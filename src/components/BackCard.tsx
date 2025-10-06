import React from 'react';
import EmailIcon from '../assets/icons/email.svg';
import PhoneIcon from '../assets/icons/phone.svg';
import InternetIcon from '../assets/icons/internet.svg';

function BackCard() {
    return (
        <div
            className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{ width: '450px', height: '280px' }}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700" />
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/20 blur-3xl" />

            <div className="relative z-10 h-full w-full p-6 text-white flex flex-col justify-between">
                <div>
                    <div className="text-lg font-semibold">Kompaniya nomi</div>
                    <div className="text-xs opacity-80">
                        Slogan yoki qisqa ta'rif
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src={PhoneIcon}
                            alt="phone"
                            className="w-4 h-4 opacity-90"
                        />
                        <span>+998 90 123 45 67</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <img
                            src={EmailIcon}
                            alt="email"
                            className="w-4 h-4 opacity-90"
                        />
                        <span>info@company.uz</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <img
                            src={InternetIcon}
                            alt="website"
                            className="w-4 h-4 opacity-90"
                        />
                        <span>www.company.uz</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BackCard;
