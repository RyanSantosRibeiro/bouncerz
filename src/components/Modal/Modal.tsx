'use client'

import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  cta: {
    text: string,
    type: string
  }
}

export default function Modal({children, cta}:Props) {


  return (
    <div>
        {/* @ts-ignore */}
        <button className={`w-auto px-3 btn bg-[#2cb1c3] h-full mx-auto text-[10px] 2xl:text-[14px]`} onClick={()=>document.getElementById('my_modal_2').showModal()}>{cta?.text || "open"}</button>
        <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
        {children}
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    </div>
  );
}
