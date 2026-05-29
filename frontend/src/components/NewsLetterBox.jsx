import React from 'react';

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault(); // منع الصفحة من الريفرش عند إرسال الفورم
    };

    return (
        <div className='text-center my-20 w-full max-w-7xl mx-auto px-4'>
            {/* عنوان جذاب بيعرض قيمة واضحة للعميل (خصم 20%) */}
            <p className='text-2xl font-medium text-gray-800'>
                Subscribe now & get 20% off
            </p>
            
            {/* 🌟 وصف بروفيشينال بديل للـ Lorem Ipsum المزعجة */}
            <p className='text-gray-400 mt-3 text-xs sm:text-sm font-normal leading-relaxed w-3/4 m-auto'>
                Join our newsletter today to unlock exclusive insider offers, stay ahead of the style curve, and get early access to our newest drops.
            </p>

            {/* فورم تجميع الإيميلات الشيك */}
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 border-gray-300 rounded-sm shadow-sm focus-within:border-black transition-colors bg-white'>
                <input 
                    className='w-full sm:flex-1 outline-none text-sm py-3 text-gray-700 bg-transparent' 
                    type="email" 
                    placeholder='Enter your email address' 
                    required 
                />
                <button 
                    type='submit' 
                    className='bg-black text-white text-xs font-medium px-10 py-4 active:bg-gray-700 transition hover:opacity-95 tracking-wider rounded-r-sm'
                >
                    SUBSCRIBE
                </button>
            </form>
        </div>
    );
};

export default NewsletterBox;