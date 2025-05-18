import { Check, X } from 'lucide-react'
import React from 'react'

const Notification = () => {
  return (
    <>
        <div className="">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <img
                src={"/avatar.png"}
                alt="Profile"
                className="size-12 rounded-full object-cover border-2"
            />
            <div className='flex flex-col py-1 gap-2'>
                <div className='pl-3 text-center'>
                    <p className="rounded-lg">Kapil vaishanv</p>
                </div>
                <div className="flex pl-4 gap-16">
                    <button className="cursor-pointer hover:text-red-500 transition-colors tooltip tooltip-right" data-tip="Reject" onClick={() => console.log("Decline/ not accepted")}>
                        <X className="size-5" />
                    </button>
                    <button className="cursor-pointer hover:text-green-500 transition-colors tooltip tooltip-left" data-tip="Accept" onClick={() => console.log("accepted")}>
                      <Check className="size-5" />
                    </button>
                </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default Notification