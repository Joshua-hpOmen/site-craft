"use server"
import { clerkClient, currentUser} from "@clerk/nextjs/server"
import { db } from "./db"
import { redirect } from "next/navigation"
import { Agency, Plan, Prisma, Role,  Tag, User } from "@prisma/client"
import { v4 } from "uuid"


type Props = {
    agencyId?: string, 
    description: string,
    subAccountId?: string
}

export const saveActLogNotification = async ({agencyId, description, subAccountId = undefined} : Props) => {
    const authUser = await currentUser();
    let userData

    if(!authUser){
        const response = await db.user.findFirst({ where: { Agency : { SubAccount : { some : { id: subAccountId } } } } })
        userData = response
    }else {
        userData = await db.user.findFirst({where : {email : authUser?.emailAddresses[0].emailAddress}})
    }

    if(!userData) console.log("No user") // This is handled by the main/agency/page. 
    
    let foundAgencyId = agencyId

    if(!foundAgencyId){
        if(!subAccountId) throw new Error("Subbacount and Agency Id not provided")

        const response = await db.subAccount.findUnique({where :{id: subAccountId}})
        if(response) foundAgencyId = response.agencyId 
    }

    if(subAccountId){
        await db.notification.create({
            data: {
                notification : `${userData?.name} | ${description}`,
                User : { connect : {id: userData?.id}},
                Agency : {connect : {id : foundAgencyId}},
                SubAccount : {connect : {id : subAccountId}}

            }
        })
    }else {
        await db.notification.create({
            data: {
                notification : `${userData?.name} | ${description}`,
                User : { connect : {id: userData?.id}},
                Agency : {connect : {id : foundAgencyId}},
            }
        })
    }
}

export const getUserAuthDetails = async () => {
    const user = await currentUser()

    if(user){
        const userData = await db.user.findUnique({
            where: {
                email: user.emailAddresses[0].emailAddress
            },
            include: {
                Agency: {
                    include: {
                        SidebarOption: true,
                        SubAccount: {include: {SidebarOption: true}}
                    }
                },
                Permissions: true
            }
        })
        return userData
    }

    return null
}

const createTeamUser = async (agencyId: string, user: User) => {
    if(user.role === 'AGENCY_OWNER') return null

    const response = await db.user.create({data: {...user}})
    return response
}

export const verifyAndAcceptInvitation = async () =>  {
    const userClerk = await currentUser();

    if(!userClerk) return redirect('/sign-in')

    const invitationExists = await db.invitation.findUnique({
        where: {
            email: userClerk.emailAddresses[0].emailAddress,
            status: "PENDING"
        }
    })

    if(invitationExists){
        const userDetails =  await createTeamUser(invitationExists.agencyId,{
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            id: userClerk.id,
            avatarUrl: userClerk.imageUrl,
            name: `${userClerk.firstName} ${userClerk.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await saveActLogNotification({agencyId: invitationExists?.agencyId, description: `User accpeted invitation | ${userDetails?.name}`, subAccountId: undefined})

        if(userDetails){
           (await clerkClient()).users.updateUserMetadata(userClerk.id, {
                privateMetadata : { role : userDetails.role || "SUBACCOUNT_USER" }
           })

           await db.invitation.delete({ where : {email: userDetails.email}})
           return userDetails?.agencyId
        }else return null
    }else{
        const agency = await db.user.findUnique({where: {email: userClerk?.emailAddresses[0].emailAddress}})

        return agency ? agency.agencyId : null
    }

}

export const updateAgencyDetails = async (inpt_id: string, agency_details: Partial<Agency>) => {
    const repsonse = await db.agency.update({
        where : {
            id: inpt_id,
        }, 
        data: {
            ...agency_details
        }
    })

    if(!repsonse) console.log("🔴i dont know why but this is an error")

    return repsonse
}

export const deleteAgency = async (inpt_id: string) => {
    const response = await db.agency.delete({
        where: {
            id: inpt_id
        }
    })

    return response
}

export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser();
    if(!user) return;
    const newUserData = db.user.upsert({
        where : {
            email: user.emailAddresses[0].emailAddress,
        },
        update: newUser,
        create: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            avatarUrl:user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            role: newUser.role
        }
    })

    const client = await clerkClient()

    client.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: newUser.role || "SUBACCOUNT_USER"
        }
    })

    return newUserData
}

export const upsertAgency = async (agency: Prisma.AgencyCreateInput) => {
    if(!agency.companyEmail) return null

    try{
        const agencyDetails = await db.agency.upsert({
            where: {
                id: agency.id
            },
            update: agency,
            create: {
                users: {
                    connect: { email: agency.companyEmail }
                },
                ...agency,
                SidebarOption: {
                    create: [
                        { name: 'Dashboard', icon: 'category', link: `/agency/${agency.id}` },
                        { name: 'Launchpad', icon: 'clipboardIcon', link: `/agency/${agency.id}/launchpad` },
                        { name: 'Billing', icon: 'payment', link: `/agency/${agency.id}/billing` },
                        { name: 'Settings', icon: 'settings', link: `/agency/${agency.id}/settings` },
                        { name: 'Sub Accounts', icon: 'person', link: `/agency/${agency.id}/all-subaccounts` },
                        { name: 'Team', icon: 'shield', link: `/agency/${agency.id}/team` },
                    ],
                }
            }
        })

        return agencyDetails
    }
    catch(err){
        console.error(err)
        return null;
    }
}

export const getNotifcationAndUser = async (agencyId: string) => {
    try{
        const response = await db.notification.findMany({
            where : { id: agencyId},
            include: { User : true },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return response
    }catch(err){
        console.log(err)
    }
}

export const upsertSubbaccount = async (subbaccountInfo: Prisma.SubAccountCreateManyInput) => {
    if(!subbaccountInfo.companyEmail) return null;
    try {
        const agencyOwner = await db.user.findFirst({
            where: {
                Agency: {id: subbaccountInfo.agencyId},
                role: "AGENCY_OWNER"
            }
        })

        if(!agencyOwner) redirect("/unauthorised");

        
        const permissionId = v4();

        const response = db.subAccount.upsert({
            where: {id: subbaccountInfo.id},
            update: subbaccountInfo,
            create: {
                ...subbaccountInfo,
                Permissions: {
                    create: {
                        access: true,
                        email: agencyOwner.email,
                        id: permissionId,
                    },
                },

                Pipeline: {
                    create: {name: 'Lead Cycle'}
                },
                SidebarOption: {
                    create: [
                        { name: 'Launchpad', icon: 'clipboardIcon', link: `/subaccount/${subbaccountInfo.id}/launchpad`, },
                        { name: 'Settings', icon: 'settings', link: `/subaccount/${subbaccountInfo.id}/settings`, },
                        { name: 'Funnels', icon: 'pipelines', link: `/subaccount/${subbaccountInfo.id}/funnels`, },
                        { name: 'Media', icon: 'database', link: `/subaccount/${subbaccountInfo.id}/media`, },
                        { name: 'Automations', icon: 'chip', link: `/subaccount/${subbaccountInfo.id}/automations`, },
                        { name: 'Pipelines', icon: 'flag', link: `/subaccount/${subbaccountInfo.id}/pipelines`, },
                        { name: 'Contacts', icon: 'person', link: `/subaccount/${subbaccountInfo.id}/contacts`, },
                        { name: 'Dashboard', icon: 'category', link: `/subaccount/${subbaccountInfo.id}`, },
                    ],
                }
            }
        })

        return response
    } catch (error) {
        console.error(error)
    }
}

export const getUserPermissions = async (userId: string) => {
    const response = await db.user.findUnique({
        where: {id : userId},
        select: {Permissions: {include: {SubAccount : true}}}
    })

    return response
}

export const updateUser = async (values: Partial<User>) => {
    const user = await db.user.update({
        where: {email: values.email},
        data: {...values}
    })

    const client = await clerkClient()

    client.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: values.role || "SUBACCOUNT_USER"
        }
    })

    return user;
}

export const changeUserPermissions = async (permissionId: string | undefined, agencyOwnerEmail:string, subbAccountId : string, permissionVal: boolean) => {
    try{
        const resposne = await db.permissions.upsert({
            where: {id: permissionId},
            update: {access: permissionVal},
            create: { access: permissionVal, subAccountId: subbAccountId, email: agencyOwnerEmail }
         })
         return resposne
    }catch{
        console.log("🔴Couldnt create or update permission from query.ts/changeUserPermissions")
    }

}

export const getSubAccountDetails = async (subAccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {id: subAccountId}
    })

    return response
}

export const deleteSubaccount = async (subAccountId:string) => {
    const response = await db.subAccount.delete({
        where: {id: subAccountId}
    })

    return response
}

export const getUser = async (id: string) => {
    const response = await db.user.findUnique({where : {id: id}})
    return response
}

export const deleteUser = async (id: string) => {
    const response = await db.user.delete({where : {id: id}})
    return response
}

export const sendInvitation = async(role: Role, email: string, agencyId: string) => {
    const response = await db.invitation.create({
        data: { email, agencyId, role}
    })

    try{
        (await clerkClient()).invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.NEXT_PUBLIC_URL,
            publicMetadata: {
                throughInvitation: true,
                role,
            }
        })

    }catch(err) {
        console.log("🔴Error could not send invitation")
        console.error(err)
    }

    return response
}

export const getMedia = async (id: string) => {
    const response = await db.media.findMany({where: {subAccountId: id}})
    return response
}

export const createMedia = async (subaccountId: string, values: {link: string, name: string}) => {
    const response = await db.media.create({
        data: {...values, subAccountId: subaccountId}
    })
    return response
}

export const deleteMedia = async (mediaId: string) => {
    const response = await db.media.delete({where: {id: mediaId}})

    return response
}

export const getPipelineDetails = async (pipelineId: string) => {
    const response = await db.pipeline.findUnique({where: {id: pipelineId}})
    return response
}

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
    const response = await db.lane.findMany({
        where: {pipelineId: pipelineId},
        orderBy: {order: "asc"},
        include: {
            Tickets: {
                orderBy: {order: "asc"},
                include: { Tags: true, Assigned: true, Customer: true }
            }
        }
    })

    return response
}

export const upsertPipeline = async ({values, id, subaccountId}: {values: string, id?: string, subaccountId: string}) => {
    const response  = await db.pipeline.upsert({
        where: {id: id || v4()},
        update: {name: values, id: id},
        create: {
            name: values,
            subAccountId: subaccountId
        }
    })

    return response
}

export const deletePipeline = async (id: string) => {
    const response = await db.pipeline.delete({where: {id: id}})

    return response
}

export const upsertLane = async ({values, id, pipelineId, order} : {values: {name: string}, id?: string, pipelineId: string , order?: number}) => {
    let orderLane = order;
    if(!Boolean(orderLane)){
        const lanes = await db.lane.count({where: {pipelineId: pipelineId}})
        orderLane = lanes 
    }
    const response = await db.lane.upsert({
        where: {id: id || v4()}, 
        update: {...values, order: orderLane},
        create: {
            ...values,
            pipelineId: pipelineId,
            order: orderLane
        },
    })
    return response
}

export const getLanes = async (pipelineId: string) => {
    const response  = await db.lane.findMany({
        where: {pipelineId: pipelineId},
        orderBy: {order: "asc"},
        include: {Tickets: {
            include: {
                Tags: true,
                Customer: true,
                Assigned: true
            }
        }}
    })

    return response
}

export const getTicketsAndTags = async (laneId: string) => {
    const response = await db.ticket.findMany({
        where: {laneId: laneId},
        include : {
            Tags: true,
            Customer: true,
            Assigned: true
        }
    })
    return response
}

export const deleteLane = async (laneId:string) => {
    const response = await db.lane.delete({where : {id: laneId}})
    return response
}

export const getLaneTags = async (subAccountId :string) => {
    const response = await db.tag.findMany({where: {subAccountId: subAccountId}})
    return response
}

export const createTags = async (subaccountId : string, name: string, color: string) => {
    const response = await db.tag.create({
        data: {
            name: name,
            color: color,
            subAccountId: subaccountId
        }
    })
    return response
}

export const deleteTag = async (tagId: string) => {
    const response = await db.tag.delete({where: {id: tagId}})
    return response
}

export const  getPipelineCount = async (pipelineId: string) => {
    const laneCount = await db.lane.count({where: {pipelineId: pipelineId}})
    return laneCount
}

export const getSubaccountTeamMembers = async (subaccountId: string) => {
    const response = await db.user.findMany({
        where: {
            Agency: { SubAccount: { some: { id: subaccountId } } },
            role: 'SUBACCOUNT_USER',
            Permissions: { some: { subAccountId: subaccountId, access: true } },
        },
    })
  return response
}

export const getContact = async (subaccountId:string) => {
    const response = await db.contact.findMany({where : {subAccountId: subaccountId}})
    return response
}

export const upsertTicket = async (input : Prisma.TicketCreateManyAssignedInput, tags: Tag[]) => {
    let orderTicket = input.order;
    if(!Boolean(orderTicket)){
        const lanes = await db.ticket.count({where: {laneId: input.laneId}})
        orderTicket = lanes 
    }
    const response = await db.ticket.upsert({
        where:{id: input.id || v4()},
        update: {laneId: input.laneId, name: input.name, customerId : input.customerId, description: input.description, value: input.value, Tags: {
            set: [],
            connect: tags.map(tag => ({ id: tag.id })),
        }},
        create: {
            ...input,
            order: orderTicket,
            Tags: {
                connect: tags.map(tag => ({id:tag.id}))
            },
        },
    })

    return response
}

export const deleteTicket = async (tickId: string) => {
    const response = await db.ticket.delete({where: {id: tickId}})

    return response
}

export const upsertContact = async (value : {name: string, email: string}, subaccountId: string, id?: string) => {
    const response = await db.contact.upsert({
        where: {id: id|| v4()},
        update: {...value},
        create: {
            ...value,
            subAccountId: subaccountId
        }
    })

    return response
}

export const createFunnel = async (values : {name: string, favicon: string, subDomainName: string}, subaccountId: string, id?: string) => {
    const response = await db.funnel.upsert({
        where: {id : id || v4()},
        update: {...values},
        create: {
            ...values,
            subAccountId: subaccountId
        }
    }) 

    return response
}

export const upsertSubscription = async (agencyId: string, data:  {
    active: boolean;
    agencyId: string;
    customerId: string;
    currentPeriodEndDate: Date;
    priceId: string;
    subscriptionId: string;
    plan: Plan;
}) => {

    try {
        console.log("🟢This is the end date ",data.currentPeriodEndDate)
        console.log("🟢This is the data error: ", data)
        const response = await db.subscription.upsert({
            where: {id: agencyId},
            update: data,
            create: {id: v4(), ...data}
        }) 

        console.log("🟢This is the repsonse from the query ",response)
        return response
    } catch (error) {
        console.log("🔴There was an error when creating the sub: ", error)        
    }
}

export const getFunnel = async (funnelId:string) => {

    const response = await db.funnel.findUnique({
        where: {id: funnelId},
        include: {
            FunnelPages: {
                orderBy: { order: "asc" }
            }
        }
    })

    return response
}

export const updateFunnelProducts = async ( products: string, funnelId: string ) => {
  const response = await db.funnel.update({
    where: { id: funnelId },
    data: { liveProducts: products },
  })
  return response
}

export const deleteFunnelPage = async (funnelPageId: string) => {
    const response = await db.funnelPage.delete({where: {id: funnelPageId}}) 
    return response
}

export const getFunnels = async (subaccountId: string) => {
    const response  = await db.funnel.findMany({ where: {subAccountId: subaccountId}, include: { FunnelPages: true } })

    return response
}

export const upsertFunnelPage = async (subaccountId: string, values: Prisma.FunnelPageCreateWithoutFunnelInput, funnelId: string) => {
    if (!subaccountId || !funnelId) return
    
    const response = await db.funnelPage.upsert({
        where: { id: values.id || v4()},
        update: {...values},
        create: {
            ...values,
            content: values.content ? values.content : JSON.stringify([
                {
                content: [],
                id: '__body',
                name: 'Body',
                styles: { backgroundColor: 'white' },
                type: '__body',
                },
            ]),
            funnelId,
        }, 
    })

    return response
} 

export const getFunnelPageDetails = async (funnelPageId : string) => {
    const response = await db.funnelPage.findUnique({ where: { id: funnelPageId } })

    return response
}

export const getDomainContent = async (subDomainName: string) => {
    const response = await db.funnel.findUnique({
        where: {subDomainName},
        include: { FunnelPages : true }
    })

    return response
}

export const getPipelines = async (subaccountId: string) => {
    const response = await db.pipeline.findMany({
        where: {subAccountId: subaccountId},
        include: { Lane: { include: { Tickets: true } } }
    })

    return response
}

export const getCustomComponents = async (subaccountId: string) => {
    const response = await db.customComponents.findMany({
        where: {subaccountId}
    })

    return response
}

export const saveComponent = async (subaccountId: string, code: string, name: string, componentId?:string) => {
    const response = await db.customComponents.upsert({
        where: {id: componentId || v4()},
        update: {
            innerHTML: code,
            name
        },
        create: {
            subaccountId: subaccountId,
            innerHTML: code,
            name
        }
    })

    return response
}

export const getCustomComponent = async (componentId: string) => {
    const response = await db.customComponents.findUnique({ where: { id: componentId }})
    return response
}

export const deleteCustomComponent = async (componentId: string) => {
    const response = await db.customComponents.delete({where: {id: componentId}})

    return response
}

export const getNotifications = async (userId: string) => {
    const respones = await db.notification.findMany({
        where: { userId }
    })

    return respones
}