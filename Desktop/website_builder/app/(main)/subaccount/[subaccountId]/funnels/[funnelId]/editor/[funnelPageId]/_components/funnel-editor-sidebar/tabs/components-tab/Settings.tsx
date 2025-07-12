import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { AlignCenter, AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyEndIcon, AlignHorizontalJustifyStart, AlignHorizontalSpaceAround, AlignHorizontalSpaceBetween, AlignJustify, AlignLeft, AlignRight, AlignVerticalJustifyCenter, Check, ChevronDown, ChevronRightIcon, ChevronsUpDown, LucideImageDown } from 'lucide-react'
import React from 'react'

type Props = {}


const fontTypes : string[] = [
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
  "Trebuchet MS, sans-serif",
  "Palatino Linotype, serif",
  "Lucida Console, monospace",
  "Tahoma, sans-serif",
  "Impact, sans-serif",
  "Comic Sans MS, cursive, sans-serif",
  "Gill Sans, sans-serif",
  "Franklin Gothic Medium, sans-serif",
  "Garamond, serif",
  "Segoe UI, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lato, sans-serif",
  "Montserrat, sans-serif",

  /* Additional Fonts */
  "Arial Black, sans-serif",
  "Comic Sans, cursive, sans-serif",
  "Courier, monospace",
  "Lucida Sans, sans-serif",
  "Georgia, serif",
  "Andale Mono, monospace",
  "Chalkboard, sans-serif",
  "Fira Sans, sans-serif",
  "Tahoma, Geneva, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Merriweather, serif",
  "Playfair Display, serif",
  "Droid Sans, sans-serif",
  "Droid Serif, serif",
  "Source Sans Pro, sans-serif",
  "Raleway, sans-serif",
  "Poppins, sans-serif",
  "Ubuntu, sans-serif",
  "Quicksand, sans-serif",
  "Noto Sans, sans-serif",
  "Work Sans, sans-serif",
  "Rubik, sans-serif",
  "Lora, serif",
  "Muli, sans-serif",
  "Bitter, serif",
  "Inter, sans-serif",
  "Cabin, sans-serif",
  "Karla, sans-serif",
  "Nunito, sans-serif",
  "Futura, sans-serif",
  "Oswald, sans-serif",
  "Lobster, cursive",
  "Pacifico, cursive",
  "Bree Serif, serif",
  "Anton, sans-serif",
  "Zilla Slab, serif",
  "Monda, sans-serif",
  "Lexend, sans-serif",
  "Sora, sans-serif",
  "Cairo, sans-serif",
  "Poppins, sans-serif",
  "Barlow, sans-serif"
]

const colorArr: string[][] =[
  // Gray colors (unchanged)
  ["white", "white"],
  ["gray-200", "#e5e7eb"],
  ["gray-300", "#d1d5db"],
  ["gray-400", "#9ca3af"],
  ["gray-500", "#6b7280"],
  ["gray-600", "#4b5563"],
  ["gray-700", "#374151"],
  ["gray-800", "#1f2937"],
  ["gray-900", "#111827"],
  ["black", "black"],

  // Red colors (ending with red-950)
  ["red-100", "#fee2e2"],
  ["red-200", "#fecaca"],
  ["red-300", "#fca5a5"],
  ["red-400", "#f87171"],
  ["red-500", "#ef4444"],
  ["red-600", "#dc2626"],
  ["red-700", "#b91c1c"],
  ["red-800", "#991b1b"],
  ["red-900", "#7f1d1d"], // 900
  ["red-950", "#7f1d1d"], // 950

  // Yellow colors (ending with yellow-950)
  ["yellow-100", "#fef3c7"],
  ["yellow-200", "#fde68a"],
  ["yellow-300", "#fcd34d"],
  ["yellow-400", "#fbbf24"],
  ["yellow-500", "#f59e0b"],
  ["yellow-600", "#d97706"],
  ["yellow-700", "#b45309"],
  ["yellow-800", "#92400e"],
  ["yellow-900", "#78350f"], // 900
  ["yellow-950", "#78350f"], // 950

  // Green colors (ending with green-950)
  ["green-100", "#d1fae5"],
  ["green-200", "#a7f3d0"],
  ["green-300", "#6ee7b7"],
  ["green-400", "#34d399"],
  ["green-500", "#10b981"],
  ["green-600", "#059669"],
  ["green-700", "#047857"],
  ["green-800", "#065f46"],
  ["green-900", "#064e3b"], // 900
  ["green-950", "#064e3b"], // 950

  // Blue colors (ending with blue-950)
  ["blue-100", "#dbeafe"],
  ["blue-200", "#bfdbfe"],
  ["blue-300", "#93c5fd"],
  ["blue-400", "#60a5fa"],
  ["blue-500", "#3b82f6"],
  ["blue-600", "#2563eb"],
  ["blue-700", "#1d4ed8"],
  ["blue-800", "#1e40af"],
  ["blue-900", "#1e3a8a"], // 900
  ["blue-950", "#1e3a8a"], // 950

  // Indigo colors (ending with indigo-950)
  ["indigo-100", "#e0e7ff"],
  ["indigo-200", "#c7d2fe"],
  ["indigo-300", "#a5b4fc"],
  ["indigo-400", "#818cf8"],
  ["indigo-500", "#6366f1"],
  ["indigo-600", "#4f46e5"],
  ["indigo-700", "#4338ca"],
  ["indigo-800", "#3730a3"],
  ["indigo-900", "#312e81"], // 900
  ["indigo-950", "#312e81"], // 950

  // Violet colors (ending with violet-950)
  ["violet-100", "#ede9fe"],
  ["violet-200", "#ddd6fe"],
  ["violet-300", "#c4b5fd"],
  ["violet-400", "#a78bfa"],
  ["violet-500", "#8b5cf6"],
  ["violet-600", "#7c3aed"],
  ["violet-700", "#6d28d9"],
  ["violet-800", "#5b21b6"],
  ["violet-900", "#4c1d95"], // 900
  ["violet-950", "#4c1d95"], // 950

  // Purple colors (ending with purple-950)
  ["purple-100", "#e9d5ff"],
  ["purple-200", "#d8b4fe"],
  ["purple-300", "#c084fc"],
  ["purple-400", "#a855f7"],
  ["purple-500", "#9333ea"],
  ["purple-600", "#7e22ce"],
  ["purple-700", "#6b21a8"],
  ["purple-800", "#581c87"],
  ["purple-900", "#4c1d6e"], // 900
  ["purple-950", "#4c1d6e"], // 950

  // Pink colors (ending with pink-950)
  ["pink-100", "#fce7f3"],
  ["pink-200", "#fbcfe8"],
  ["pink-300", "#f9a8d4"],
  ["pink-400", "#f472b6"],
  ["pink-500", "#ec4899"],
  ["pink-600", "#db2777"],
  ["pink-700", "#be185d"],
  ["pink-800", "#9d174d"],
  ["pink-900", "#831843"], // 900
  ["pink-950", "#831843"], // 950

  // Teal colors (ending with teal-950)
  ["teal-100", "#ccfbf1"],
  ["teal-200", "#99f6e4"],
  ["teal-300", "#5eead4"],
  ["teal-400", "#26d6a5"],
  ["teal-500", "#14b8a6"],
  ["teal-600", "#0d9488"],
  ["teal-700", "#0f766e"],
  ["teal-800", "#115e59"],
  ["teal-900", "#134e4a"], // 900
  ["teal-950", "#134e4a"], // 950

  // Cyan colors (ending with cyan-950)
  ["cyan-100", "#cffafe"],
  ["cyan-200", "#a5f3fc"],
  ["cyan-300", "#67e8f9"],
  ["cyan-400", "#22d3ee"],
  ["cyan-500", "#06b6d4"],
  ["cyan-600", "#0891b2"],
  ["cyan-700", "#0e7490"],
  ["cyan-800", "#155e75"],
  ["cyan-900", "#164e63"], // 900
  ["cyan-950", "#164e63"], // 950

  // Mint colors (ending with mint-950)
  ["mint-100", "#dcfce7"],
  ["mint-200", "#bbf7d0"],
  ["mint-300", "#86efac"],
  ["mint-400", "#4ade80"],
  ["mint-500", "#22c55e"],
  ["mint-600", "#16a34a"],
  ["mint-700", "#15803d"],
  ["mint-800", "#166534"],
  ["mint-900", "#14532d"], // 900
  ["mint-950", "#14532d"], // 950

  // Rose colors (ending with rose-950)
  ["rose-100", "#ffe4e6"],
  ["rose-200", "#fecdd3"],
  ["rose-300", "#fda4af"],
  ["rose-400", "#fb7185"],
  ["rose-500", "#f43f5e"],
  ["rose-600", "#e11d48"],
  ["rose-700", "#be123c"],
  ["rose-800", "#9f1239"],
  ["rose-900", "#881337"], // 900
  ["rose-950", "#881337"], // 950
]

const Settings = (props: Props) => {
    const {state, dispatch} = useEditor()
    const [showCustom, setShowCustom] = React.useState(true)
    const [showTypography, setShowTypography] = React.useState(true)
    const [showDimensions, setShowDimension] = React.useState(true)
    const [showDecoration, setShowDecoration] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const [openColorWheel, setOpenColorWheel] = React.useState(false)
    const [openColorWheelBg, setOpenColorWheelBg] = React.useState(false)

    const showCustomhandler = () => { setShowCustom(prev => !prev) }
    const showTypographyHandler = () => { setShowTypography(prev => !prev )}
    const showDimensionsHandler = () => { setShowDimension(prev => !prev) }
    const showDecorationHandler = () => { setShowDecoration(prev => !prev) }


    const handleChangeCustomValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        const settingsProperty = e.target.id
        const value = e.target.value
        //Defining it this way allows for it to be dynamic
        const styleObject = {
            [settingsProperty] : value
        }

        dispatch({
            type: "UPDATE_ELEMENT",
            payload : {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        ...styleObject
                    }
                }
            }
        })

    }

    const handleOnChange= (changeObject : {target: {id: string, value: string}}) => {

        const styleObject =  {
            [changeObject.target.id] : changeObject.target.value
        }

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails : {
                    ...state.editor.selectedElement,
                    styles: {
                        ...state.editor.selectedElement.styles,
                        ...styleObject
                    }
                }
            }
        })

    }


  return (
    <div className='max-h-full'>
        <header>
            <h1 className='text-lg font-semibold'>Styles</h1>

            <p className='text-sm text-muted-foreground'>Show you creativity! You can customize every component as you like.</p>
        </header>

        <br />

        <main className='flex flex-col gap-3'>

            {/* Custom section mainly for the link */}
            <div>

                <h2 className='w-full flex justify-between items-center' onClick={showCustomhandler}>Custom <ChevronDown size={17}/></h2>
                {showCustom && <div className=''>
                    {
                        state.editor.selectedElement.type === "link" && !Array.isArray(state.editor.selectedElement.content) && (
                            <div><br />
                                <p className='text-muted-foreground mb-2'>Link Path</p>
                                <Input id="href" placeholder='https:domain.example.com/pathname' onChange={handleChangeCustomValues} value={state.editor.selectedElement.content.href}/>
                            </div>
                        )
                    }

                    {
                        state.editor.selectedElement.type === "image" && !Array.isArray(state.editor.selectedElement.content) && (
                            <div><br />
                                <p className='text-muted-foreground mb-2'>Image src:</p>
                                <Input id='src' placeholder='https:image.url.com' onBlur={handleChangeCustomValues} defaultValue={state.editor.selectedElement.content.src}/>
                            </div>
                        )
                    }
                </div>}

            </div>

            {/* Typography section */}

            <div>

                <h2 className='w-full flex justify-between items-center' onClick={showTypographyHandler}>Typography <ChevronDown size={17}/></h2>
                {showTypography && 
                    <div> <br />
                            <div>
                                <h2 className='text-sm text-muted-foreground'>Text Align</h2> <br />
                                <div className='flex rounded-md border-2 border-slate-700'>
                                    <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.textAlign === "left"})} onClick={() => handleOnChange({target :{ id: "textAlign", value: "left"}})}><AlignLeft size={20}/></span>
                                    <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.textAlign === "right"})} onClick={() => handleOnChange({target :{ id: "textAlign", value: "right"}})}><AlignRight size={20}/></span>
                                    <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.textAlign === "center"})} onClick={() => handleOnChange({target :{ id: "textAlign", value: "center"}})}><AlignCenter size={20}/></span>
                                    <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.textAlign === "justify"})} onClick={() => handleOnChange({target :{ id: "textAlign", value: "justify"}})}><AlignJustify size={20}/></span>
                                </div>
                            </div>

                            <br />

                            <div>
                                <h2 className='text-sm text-muted-foreground'>Font family</h2> <br />

                                <Popover open={open} onOpenChange={setOpen}>

                                    <PopoverTrigger asChild>

                                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" >
                                            {state.editor.selectedElement.styles.fontFamily ? <span style={{fontFamily: state.editor.selectedElement.styles.fontFamily}}>{fontTypes.find((font) => font === state.editor.selectedElement.styles.fontFamily)}</span>: "Select font..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>

                                    </PopoverTrigger>

                                    <PopoverContent className="w-full p-0">
                                        <Command>

                                            <CommandInput placeholder="Search font..." className="h-9" />

                                            <CommandList>
                                                <CommandEmpty>No fonts found.</CommandEmpty>

                                                <CommandGroup>

                                                    {fontTypes.map((font, index) => (
                                                        <CommandItem key={index} value={font} onSelect={() => {
                                                            handleOnChange({target: {id: "fontFamily", value: font}})
                                                            setOpen(false)
                                                        }}>
                                                            <span style={{fontFamily : font}}>
                                                                {font}
                                                            </span>
                                                            <Check className={cn( "ml-auto", state.editor.selectedElement.styles.fontFamily === font ? "opacity-100" : "opacity-0")} />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>

                                            </CommandList>

                                        </Command>
                                    </PopoverContent>

                                </Popover>
                                
                            </div>

                            <br />

                            <div className='relative w-full'>
                                <h2 className='text-sm text-muted-foreground'>Text color</h2> <br />

                                <div className={clsx('w-full justify-between flex border-2 border-slate-800 rounded-md p-2', {"!border-primary" : openColorWheel})} onClick={() => setOpenColorWheel(prev => !prev)}>
                                    <div className='flex gap-2'>
                                        {state.editor.selectedElement.styles.color &&  <span className='py-1 px-3 rounded-full' style={{backgroundColor: state.editor.selectedElement.styles.color}}></span> }
                                        <span>{state.editor.selectedElement.styles.color ? <span>{colorArr.find(color => color[1] === state.editor.selectedElement.styles.color)?.slice(0, 1).toString().replace("-", " ").toUpperCase()}</span>: "Select a color"}</span>
                                    </div>

                                    <ChevronDown/>
                                </div>

                                {openColorWheel &&
                                    <div className='absolute grid p-3 rounded-md border-2 mt-2 border-slate-700 bg-slate-800 grid-flow-col grid-rows-10 grid-cols-13 w-full'>
                                        {colorArr.map((color, index) => (
                                            <div className='p-2 cursor-pointer' key={index} style={{backgroundColor: color[1]}} onClick={() => { 
                                                handleOnChange({target: {id: "color", value: color[1]}})
                                                setOpenColorWheel(false)
                                            }}></div>
                                        ))}
                                    </div>
                                }

                            </div>

                            <br />

                            <div className='w-full flex items-center gap-3'>
                                <div className='flex-[0.7]'>
                                    <h2 className='text-sm text-muted-foreground'>Weight</h2> <br />

                                    <Select  onValueChange={(e) => handleOnChange({ target: { id: 'font-weight', value: e, }, }) } >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a weight" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className='underline'>Font Weights</SelectLabel>
                                                <SelectItem value="bold">Bold</SelectItem>
                                                <SelectItem value="normal">Regular</SelectItem>
                                                <SelectItem value="lighter">Light</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className='flex-[0.3]'>
                                    <h2 className='text-sm text-muted-foreground'>Size</h2> <br />
                                    <Input value={state.editor.selectedElement.styles.fontSize?.toString().endsWith("px") ? state.editor.selectedElement.styles.fontSize?.toString().split("p")[0] : state.editor.selectedElement.styles.fontSize || ""} placeholder='px' onChange={(e) => handleOnChange({target: {id: "fontSize" , value: `${e.target.value}px`}})}/>
                                </div>
                            </div>

                    </div>
                }

            </div>

            {/* Dimension section */}

            <div>
                <h2 className='w-full flex justify-between items-center' onClick={showDimensionsHandler}>Dimensions <ChevronDown size={17}/></h2> 

                {showDimensions &&<>
                    <br />
                    <div className='flex justify-between gap-5'> 
                    
                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="height">Height:</label>
                            <Input id='height' type="number" value={state.editor.selectedElement.styles.height?.toString().endsWith("px") ? state.editor.selectedElement.styles.height?.toString().split("p")[0] : state.editor.selectedElement.styles.height || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="width">Width:</label>
                            <Input id='width' type="number"  value={state.editor.selectedElement.styles.width?.toString().endsWith("px") ? state.editor.selectedElement.styles.width?.toString().split("p")[0] : state.editor.selectedElement.styles.width || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                    </div>

                    <br />

                    <div className='grid grid-cols-2 gap-3'>

                        <h2 className='text-sm col-span-2'>Margin</h2>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="marginTop">Top:</label>
                            <Input id='marginTop' type="number" value={state.editor.selectedElement.styles.marginTop?.toString().endsWith("px") ? state.editor.selectedElement.styles.marginTop?.toString().split("p")[0] : state.editor.selectedElement.styles.marginTop || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="marginBottom">Bottom:</label>
                            <Input id='marginBottom' type="number"  value={state.editor.selectedElement.styles.marginBottom?.toString().endsWith("px") ? state.editor.selectedElement.styles.marginBottom?.toString().split("p")[0] : state.editor.selectedElement.styles.marginBottom || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="marginRight">Right:</label>
                            <Input id='marginRight' type="number" value={state.editor.selectedElement.styles.marginRight?.toString().endsWith("px") ? state.editor.selectedElement.styles.marginRight?.toString().split("p")[0] : state.editor.selectedElement.styles.marginRight || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="marginLeft">Left:</label>
                            <Input id='marginLeft' type="number"  value={state.editor.selectedElement.styles.marginLeft?.toString().endsWith("px") ? state.editor.selectedElement.styles.marginLeft?.toString().split("p")[0] : state.editor.selectedElement.styles.marginLeft || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>
                    </div>

                    <br />

                    <div className='grid grid-cols-2 gap-3'>

                        <h2 className='text-sm col-span-2'>Padding</h2>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="paddingTop">Top:</label>
                            <Input id='paddingTop' type="number" value={state.editor.selectedElement.styles.paddingTop?.toString().endsWith("px") ? state.editor.selectedElement.styles.paddingTop?.toString().split("p")[0] : state.editor.selectedElement.styles.paddingTop || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="paddingBottom">Bottom:</label>
                            <Input id='paddingBottom' type="number"  value={state.editor.selectedElement.styles.paddingBottom?.toString().endsWith("px") ? state.editor.selectedElement.styles.paddingBottom?.toString().split("p")[0] : state.editor.selectedElement.styles.paddingBottom || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="paddingRight">Right:</label>
                            <Input id='paddingRight' type="number" value={state.editor.selectedElement.styles.paddingRight?.toString().endsWith("px") ? state.editor.selectedElement.styles.paddingRight?.toString().split("p")[0] : state.editor.selectedElement.styles.paddingRight || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>

                        <div className='flex gap-1 flex-col'>
                            <label className='text-sm text-muted-foreground' htmlFor="paddingLeft">Left:</label>
                            <Input id='paddingLeft' type="number"  value={state.editor.selectedElement.styles.paddingLeft?.toString().endsWith("px") ? state.editor.selectedElement.styles.paddingLeft?.toString().split("p")[0] : state.editor.selectedElement.styles.paddingLeft || ""} placeholder='0px' onChange={(e) => handleOnChange({target: {id: e.target.id, value: `${e.target.value}px`}})}/>
                        </div>
                    </div>
                    <br />
                </>
                }

            </div>

            {/* Decorations section */}

            <div>
                <h2 className='w-full flex justify-between items-center' onClick={showDecorationHandler}>Decortations <ChevronDown size={17}/></h2> 

                {showDecoration && 

                    <div>

                        <br />

                        <div className='flex flex-col gap-2'>
                            <h2 className='text-sm'>Opacity</h2>
                            
                            <div className='flex gap-2 flex-col'>
                                <small className=' text-right'>
                                    {typeof state.editor.selectedElement.styles.opacity === "number" ? state.editor.selectedElement.styles.opacity : 
                                    parseFloat((state.editor.selectedElement.styles.opacity || "0").replace("%", "")) || 0}%
                                </small>
                                        
                                <Slider onValueChange={e => handleOnChange({ target: { id: "opacity", value: `${e[0]}%` }})}
                                        defaultValue={[typeof state.editor.selectedElement.styles?.opacity === 'number'
                                            ? state.editor.selectedElement.styles?.opacity
                                            : parseFloat( ( state.editor.selectedElement.styles?.opacity || '0' ).replace('%', '') ) || 0,]}
                                        max={100} step={1} 
                                    />
                            </div>


                        </div>

                        <br />

                        <div className='flex flex-col gap-2'>
                            <h2 className='text-sm'>Border radius</h2>

                            <div className='flex gap-2 flex-col'>
                                <small className='text-right'>
                                    {typeof state.editor.selectedElement.styles.borderRadius === "number" ? state.editor.selectedElement.styles.borderRadius : 
                                    parseFloat((state.editor.selectedElement.styles.borderRadius || "0").replace("%", "")) || 0}%
                                </small>
                                        
                                <Slider onValueChange={e => handleOnChange({ target: { id: "borderRadius", value: `${e[0]}%` }})}
                                        defaultValue={[typeof state.editor.selectedElement.styles?.borderRadius === 'number'
                                            ? state.editor.selectedElement.styles?.borderRadius
                                            : parseFloat( ( state.editor.selectedElement.styles?.borderRadius || '0' ).replace('%', '') ) || 0,]}
                                        max={100} step={1} 
                                    />
                            </div>
                        </div>

                        <br />
                                            
                        <div className='relative w-full'>
                            <h2 className='text-sm text-muted-foreground'>Background color</h2> <br />

                            <div className={clsx('w-full justify-between flex border-2 border-slate-800 rounded-md p-2', {"!border-primary" : openColorWheelBg})} onClick={() => setOpenColorWheelBg(prev => !prev)}>
                                <div className='flex gap-2'>
                                    {state.editor.selectedElement.styles.backgroundColor &&  <span className='py-1 px-3 rounded-full' style={{backgroundColor: state.editor.selectedElement.styles.backgroundColor}}></span> }
                                    <span>{state.editor.selectedElement.styles.backgroundColor ? <span>{colorArr.find(color => color[1] === state.editor.selectedElement.styles.backgroundColor)?.slice(0, 1).toString().replace("-", " ").toUpperCase() || state.editor.selectedElement.styles.backgroundColor.toUpperCase()}</span>: "Select a color"}</span>
                                </div>

                                <ChevronDown/>
                            </div>

                            {openColorWheelBg &&
                                <div className='absolute bottom-14 grid p-3 rounded-md border-2 mt-2 border-slate-700 bg-slate-800 grid-flow-col grid-rows-10 grid-cols-13 w-full'>
                                    {colorArr.map((color, index) => (
                                        <div className='p-2 cursor-pointer' key={index} style={{backgroundColor: color[1]}} onClick={() => { 
                                            handleOnChange({target: {id: "backgroundColor", value: color[1]}})
                                            setOpenColorWheelBg(false)
                                        }}></div>
                                    ))}
                                </div>
                            }

                        </div>

                        <br />

                        <div>

                            <label className='text-sm' htmlFor="backgroundImage">Background Image</label>

                            <div className='flex gap-3'>
                                {state.editor.selectedElement.styles.backgroundImage && <span className='px-4' style={{backgroundImage: state.editor.selectedElement.styles.backgroundImage}}/>}
                                <Input placeholder="url()" className="mt-2" 
                                    onChange={ (e) => handleOnChange( { target: { id: "backgroundImage", value: e.target.value } } ) } 
                                    value={ state.editor.selectedElement.styles.backgroundImage } 
                                />
                            </div>

                        </div>

                        <br />

                        <div>
                            <h2 className='text-sm'>Image Position</h2>

                            <div className='flex rounded-md mt-3 border-2 border-slate-900'>
                                <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.backgroundSize === "cover"})} onClick={() => handleOnChange({target :{ id: "backgroundSize", value: "cover"}})}><ChevronRightIcon size={20}/></span>
                                <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.backgroundSize === "contain"})} onClick={() => handleOnChange({target :{ id: "backgroundSize", value: "contain"}})}><AlignVerticalJustifyCenter size={20}/></span>
                                <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.backgroundSize === "auto"})} onClick={() => handleOnChange({target :{ id: "backgroundSize", value: "auto"}})}><LucideImageDown size={20}/></span>
                            </div>
                        </div>

                    </div>

                }
            </div>

            {/* Flexbox */}

            <div>

                <h2 className='flex justify-between items-center my-3'>
                    Flexbox <Switch onCheckedChange={(e) => handleOnChange({target: {id: "display", value: state.editor.selectedElement.styles.display === "flex" ? "block" : "flex"}})} checked={state.editor.selectedElement.styles.display === "flex"}/>
                </h2>

                {state.editor.selectedElement.styles.display === "flex" && <div>

                    <div>
                        
                        <h2 className='text-sm text-muted-foreground'>Justify Content</h2> <br />
                        
                        <div className='flex rounded-md border-2 border-slate-700'>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.justifyContent === "space-between"})} onClick={() => handleOnChange({target :{ id: "justifyContent", value: "space-between"}})}><AlignHorizontalSpaceBetween size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.justifyContent === "space-evenly"})} onClick={() => handleOnChange({target :{ id: "justifyContent", value: "space-evenly"}})}><AlignHorizontalSpaceAround size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.justifyContent === "center"})} onClick={() => handleOnChange({target :{ id: "justifyContent", value: "center"}})}><AlignHorizontalJustifyCenterIcon size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.justifyContent === "start"})} onClick={() => handleOnChange({target :{ id: "justifyContent", value: "start"}})}><AlignHorizontalJustifyStart size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.justifyContent === "end"})} onClick={() => handleOnChange({target :{ id: "justifyContent", value: "end"}})}><AlignHorizontalJustifyEndIcon size={20}/></span>
                        </div>

                    </div>

                    <br />

                    <div>
                        
                        <h2 className='text-sm text-muted-foreground'>Align Items</h2> <br />

                        <div className='flex rounded-md border-2 border-slate-700'>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.alignItems === "flex-start"})} onClick={() => handleOnChange({target :{ id: "alignItems", value: "flex-start"}})}><AlignHorizontalSpaceBetween size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.alignItems === "flex-end"})} onClick={() => handleOnChange({target :{ id: "alignItems", value: "flex-end"}})}><AlignHorizontalSpaceAround size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.alignItems === "center"})} onClick={() => handleOnChange({target :{ id: "alignItems", value: "center"}})}><AlignHorizontalJustifyCenterIcon size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.alignItems === "baseline"})} onClick={() => handleOnChange({target :{ id: "alignItems", value: "baseline"}})}><AlignHorizontalJustifyStart size={20}/></span>
                            <span className={clsx('p-3 flex-1 flex justify-center', {"bg-slate-900": state.editor.selectedElement.styles.alignItems === "stretch"})} onClick={() => handleOnChange({target :{ id: "alignItems", value: "stretch"}})}><AlignHorizontalJustifyEndIcon size={20}/></span>
                        </div>

                    </div>

                    <br />

                    <div>
                        <h2 className='text-sm text-muted-foreground'>Flex direction</h2> <br />

                        <Select onValueChange={e => handleOnChange({target: { id: "flex-direction", value: e}})}>

                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select direction" />
                            </SelectTrigger>

                            <SelectContent>
                                
                                <SelectGroup>
                                    <SelectLabel className='underline'>Direction</SelectLabel>
                                    <SelectItem value="row">Row</SelectItem>
                                    <SelectItem value="column">Column</SelectItem>
                                    <SelectItem value="row-reverse">Row-reverse</SelectItem>
                                    <SelectItem value="coloumn-reverse">Coloumn-reverse</SelectItem>
                                </SelectGroup>

                            </SelectContent>

                        </Select>

                    </div>

                    <br />

                </div>}

            </div>

        </main>
    </div>
  )
}

export default Settings