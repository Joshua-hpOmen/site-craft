'use client'
import useMobile from '@/hooks/useMobile'
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption, User } from '@prisma/client'
import clsx from 'clsx'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon, Search, X } from 'lucide-react'
import React, { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../forms/CustomModal'
import { GeneralNavBarConxtext } from '@/providers/nav-bar'
import { icons } from '@/lib/constants'
import SubAccountDetails from '../forms/SubAccountDetails'
type Props = {
    defaultOpen ?: boolean,
    subAccounts: SubAccount[],
    sideBarOpt: AgencySidebarOption[] | SubAccountSidebarOption[] | [],
    sideBarLogo: string,
    details: Partial<Agency>,
    user: any,
    id: string
}


const MenuOptions = (props: Props) => {
  const {setClose} = React.useContext(GeneralNavBarConxtext)
  const {setOpen} = useModal();
  const isMobile = useMobile();
  const [showMenu, setShowMenu] = React.useState<boolean>(false)
  const [showPopover, setShowPopover] = React.useState<boolean>(false)
  const [popOverSearch, setPopOverSearch] = React.useState<string>("")
  const searchRef = React.useRef<HTMLInputElement>(null)
  const {setVisible} = React.useContext(GeneralNavBarConxtext)
  const [sidebarOptions, setSideBarOptions] = React.useState<string>("")
  const [searchFilter, setSearchFilter] = React.useState<any []>([...props.subAccounts])
  const [sideBarOptionsFilter, setSideBarOptionsFilter] = React.useState<typeof props.sideBarOpt>([...props.sideBarOpt])

  //if(!isMobile) setShowMenu(true)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchFilter([...props.subAccounts])
    const value = e.target.value
    setPopOverSearch(value);
    
    setSearchFilter(props.subAccounts.filter(subAccount => {
      if(!!(subAccount.name.search(new RegExp(value, "i")) !== -1)) {
        return true
      }
    }))
  }
  
  const handleShowPopOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("The relative layer was clicked")
    setShowPopover(true)
    searchRef.current?.focus();
  }

  const handleSearchSidebarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSideBarOptions(e.target.value);

    if(!isMobile) {
      //@ts-ignore
      setSideBarOptionsFilter(props.sideBarOpt.filter(opt => opt.name.search(new RegExp(e.target.value, "i")) !== -1 ))
    }
  }

  return (<>
      {(isMobile === true) && (
        <div>
          <Menu onClick={() => {setShowMenu(true); setClose()}}/>
        </div>
      )}

      {Boolean(showMenu || !isMobile) && (
        <div className={clsx('flex flex-col py-4 bg-slate-950 transition-all duration-500 ease-in-out', 
        {'fixed top-0 bottom-0 animation-sidebar left-0 w-[30%] max-w-[650px] border-dashed border-slate-800 border-r-2' : !isMobile},
        {'fixed top-0 bottom-0 left-0 right-0 animation-sidebar-mobile': isMobile})}>
          {isMobile && (
      
              <div className='relative flex w-[98%] justify-end'>
                <X onClick={() =>{setShowMenu(false); setVisible()}} className=''/>
              </div>
          )}

          
          <div className='w-[100%] flex items-center flex-col gap-5 transition-all duration-500 ease-in-out'>
            <div className={clsx('w-[85%] h-[200px] relative', {'!w-[90%] !h-[130px]': !isMobile})}>
              <Suspense fallback={
                <div className='relative loadingAnimation'>
                  <Image alt="Image placeholder" src={'/assets/imagePlaceholder.png'} fill className='loadingAnimation object-cotain' sizes='(max-width: 992px) 80vh, 500px'/>
                </div>}>
                <Image src={props.sideBarLogo} alt="Agency Logo" className='object-cover rounded-sm' quality={65} fill/>
              </Suspense>
            </div>

            <div className={clsx('w-[85%] border-2 rounded-md hover:bg-slate-950 z-20', {'!w-[90%]': !isMobile})} onClick={(e) => handleShowPopOver(e)}>
              <div className='relative flex flex-row justify-between items-center px-3 py-4'>
                <div className='flex flex-row items-center gap-1'>
                  <Compass className='w-8' size={30}/>
                  <div className='flex flex-col'>
                    <span className='text-sm'>{props.details.name}</span>
                    <span className='text-gray-600 text-sm'>{props.details.address}</span>
                  </div>
                </div>
                
                <div>
                  <ChevronsUpDown color='grey'/>
                </div>
                {showPopover && (<>
                    <div className='fixed top-0 bottom-0 left-0 right-0' onClick={(e: React.MouseEvent<HTMLDivElement>) => {e.stopPropagation(); setShowPopover(false)}}></div>
                    <div className={clsx('absolute w-[400px] flex flex-col  py-5 top-10 left-1/2 -translate-x-1/2 bg-slate-900  h-[400px] rounded-md overflow-y-auto', {"!top-16 !w-[300px]": !isMobile})} onClick={(e: React.MouseEvent<HTMLDivElement>) => {e.stopPropagation()}}>
                        <div className='flex flex-col relative w-[100%] h-[100%] items-center justify-start z-50'>
                          <Search className='absolute top-3 left-8' color='#4B5563'/>
                          <input type="search" name='search' placeholder='Search Accounts' ref={searchRef} className="bg-slate-800 py-3 pl-11 w-[85%] pr-2 rounded-md outline-none placeholder:text-gray-600" value={popOverSearch} onChange={(e) => handleSearchChange(e)}/>
                          
                          <div className='w-[80%] mt-4'>
                            <span className='text-[12px] text-slate-600'>Agency</span>

                            <Link href={`/agency/${props.user.Agency.id}`}>
                              <div className='hover:bg-slate-800 px-4 py-4 rounded-sm flex flex-row items-center gap-4 bg-slate-900 border-2 border-slate-700 border-opacity-10  mt-2'>
                                <div className='w-[50px] h-[30px] relative'>
                                  <Image src={props.user?.Agency?.agencyLogo} alt="Agency Logo" className='object-cover rounded-sm' sizes='(max-width: 992px) 80vh, 500px' quality={65} fill/>                        
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[12px]'>{props.user?.Agency?.name}</span>
                                  <span className='text-[12px] text-gray-500'>{props.user?.Agency?.address}</span>
                                </div>
                              </div>
                            </Link>


                          </div>

                          <div className='mt-4 w-[80%]'>
                            <span className='text-[12px] text-slate-600'>Accounts</span>

                            {/* The default subbaccounts */}
                            {!popOverSearch.length && props.subAccounts.map((subbaccount,index) => (
                              <Link href={`/subaccount/${subbaccount.id}`} key={index}>
                                <div className='hover:bg-slate-800 px-4 py-4 rounded-sm flex flex-row items-center gap-4 bg-slate-900 border-2 border-slate-700 border-opacity-10  mt-2'>
                                  <div className='w-[50px] h-[30px] relative'>
                                    <Image src={`${subbaccount.subAccountLogo}`} alt="Agency Logo" className='object-cover rounded-sm' sizes='(max-width: 992px) 80vh, 500px' quality={65} fill/>                        
                                  </div>
                                  <div className='flex flex-col'>
                                    <span className='text-[12px]'>{subbaccount.name}</span>
                                    <span className='text-[12px] text-gray-500'>{subbaccount.address}</span>
                                  </div>
                                </div>
                              </Link>
                            ))}

                            {/* Subbaccounts filter when search */}
                            {Boolean(popOverSearch.length && searchFilter.length) && searchFilter.map((subAccount,index) => {
                              return <Link href={`/subaccount/${subAccount.id}`} key={index}>
                                <div className='hover:bg-slate-800 px-4 py-4 rounded-sm flex flex-row items-center gap-4 bg-slate-900 border-2 border-slate-700 border-opacity-10  mt-2'>
                                  <div className='w-[50px] h-[30px] relative'>
                                    <Image src={`${subAccount.subAccountLogo}`} alt="Agency Logo" className='object-cover rounded-sm' sizes='(max-width: 992px) 80vh, 500px' quality={65} fill/>                        
                                  </div>
                                  <div className='flex flex-col'>
                                    <span className='text-[12px]'>{subAccount.name}</span>
                                    <span className='text-[12px] text-gray-500'>{subAccount.address}</span>
                                  </div>
                                </div>
                              </Link>
                            })}

                            {/* When there is an invalid search */}
                            {Boolean(!(searchFilter.length) && popOverSearch.length) && (
                                <div className='text-blue-700 text-center text-[12px]'>
                                  No subaccounts
                                </div>
                            )}

                            
                          </div>

                          <div className='w-[80%] mt-auto'>
                            {(props.user?.role === "AGENCY_OWNER" || props.user?.role === "AGENCY_ADMIN") && (
                              <button className='bg-blue-700 rounded-md w-[100%] flex flex-row justify-center  items-center  gap-2 h-12' onClick={() => setOpen(
                                <CustomModal title='Create Subaccount' subheading='Create a subaccount for your agency from the side bar'>
                                  <SubAccountDetails agencyDetails={props.user?.Agency as Agency} userId={props.user?.id as string} userName={props.user?.name}/>
                                </CustomModal>
                              )}>
                                <PlusCircleIcon size={15}/>
                                Create Sub Accounts
                              </button>
                            )}
                          </div>

                        </div>

                    </div>
                  </>
                )}

              </div>

            </div>

            {!isMobile && <>
              <div className='w-[90%] text-muted-foreground text-sm'>Menu Links</div>
              <div className='w-[100%] flex justify-center relative'>
                <Search className='absolute top-3 left-[6%]' color='#4B5563' size={20}/>
                <input type="search" name="searchSideBarOptions" id="searchSideBarOptions" placeholder='Search Sidebar Options' className="pl-8 bg-slate-800 py-3 w-[90%] pr-2 rounded-md outline-none placeholder:text-gray-600 text-sm" value={sidebarOptions} onChange={(e) => handleSearchSidebarChange(e)}/>
              </div>

              <div className='flex flex-col w-[100%] pl-4'>
                {sideBarOptionsFilter.map((opt, index) => {
                  
                  const val = icons.find((icon) => icon.value === opt.icon)

                  return <Link href={opt.link} className='bg-none hover:!bg-blue-600 rounded-l-md pl-2 flex flex-row gap-3 items-center h-[50px]' key={index}>
                        {/* @ts-ignore */}
                        {<val.path/>}
                        <span>{opt.name}</span>
                  </Link>
                })}
              </div> 
            </>}


            {isMobile && <div className='flex flex-col w-[100%] pl-4 items-center'>
              {props.sideBarOpt.map((opt, index) => {
                
                const val = icons.find((icon) => icon.value === opt.icon)

                return <Link onClick={() => { if(isMobile){ setShowMenu(false); setVisible() } }} href={opt.link} className='bg-none hover:!bg-blue-600  flex flex-row gap-3 items-center h-[50px] w-[85%] rounded-md px-3' key={index}>
                      {/* @ts-ignore */}
                      {<val.path/>}
                      <span>{opt.name}</span>
                </Link>
              })}
            </div>}

          </div>
        </div>
      )}
    </>
  )
}

export default MenuOptions