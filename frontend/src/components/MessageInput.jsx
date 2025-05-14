import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const {sendMessages} = useChatStore();
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEmojiClick = (emojiData) => {
      setText(prevText => prevText + emojiData.emoji);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file.")
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleSendMessage  = async (e) => {
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;
        try{
            const messagesData = {
                text: text.trim(),
                image: imagePreview,
            }
            await sendMessages(messagesData);
            
            // clear form
            setText('');
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }catch(error){
            console.error("Failed to send message:", error);
        }
    }


  return (
    <div className='p-4 w-full relative'>
        {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-10">
            <EmojiPicker 
                onEmojiClick={handleEmojiClick}
                width={300}
                height={350}
                previewConfig={{ showPreview: false }}
            />
        </div>)}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <button
            type="button"
            className={`btn btn-circle ${showEmojiPicker ? "text-blue-500" : "text-zinc-400"}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20}/>
          </button>
        <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput