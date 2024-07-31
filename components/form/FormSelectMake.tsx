
'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from "../ui/label"

const FormSelectMake = ({ name, label, list, isColor = false, setmakeSelected , defaultMake}: { name: string, label?: string, list: any, defaultValue?: any, isColor?: boolean, setmakeSelected?: any, defaultMake?: string }) => {



  return (
    <div className=' mb-2'>
      <Label className='capitalize'>
        {label || name}
      </Label>
      <Select
        onValueChange={(value) => setmakeSelected(value)}
        name={name}
        required
        defaultValue={defaultMake}

      >
        <SelectTrigger id={name} className="mt-1 ">
          {/* <SelectValue placeholder="Select one" /> */}
          <SelectValue placeholder={`Select a ${name}`} />
        </SelectTrigger>
        <SelectContent >
          {list.map((item: any,) => {
            return (
              <SelectItem key={item.name} value={item.name}>
                <span className=' flex items-center justify-around gap-12 '>
                  {item.name}
                  {isColor && <div className="h-6 w-6 rounded-full border " style={{ backgroundColor: `${item.value}` }}>
                  </div>}
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>

      </Select>
    </div>
  )
}
export default FormSelectMake