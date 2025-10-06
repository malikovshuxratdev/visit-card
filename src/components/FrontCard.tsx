import VerifyIcon from '../assets/icons/verify.svg';
import InnovationIcon from '../assets/icons/innovation.svg';
import DefaultAvatar from '../assets/images/default-avatar.png';

function FrontCard() {
    return (
        <div
            className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            style={{ width: '450px', height: '280px' }}
        >
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'repeating-linear-gradient(115deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 10px), linear-gradient(180deg, rgba(16,185,129,0.15), rgba(16,185,129,0.15))',
                }}
            />

            <div className="absolute right-2 top-10 opacity-10 select-none">
                <img
                    src={InnovationIcon}
                    alt="watermark"
                    className="w-56 h-56"
                />
            </div>

            <div className="relative z-10 bg-emerald-600/90">
                <div className="px-5 py-3">
                    <div className="text-[18px] font-semibold tracking-wide text-slate-900">
                        SHAXSIY SICENCE ID TASHRIF KARTASI
                    </div>
                </div>
            </div>

            <div className="relative z-10 h-[calc(100%-48px)] px-5 pt-3 pb-4 text-slate-800">
                <div className="flex items-center gap-3 text-slate-900">
                    <div className="flex items-center gap-2 text-[#0b3b82]">
                        <img
                            src={InnovationIcon}
                            alt="nfc"
                            className="w-6 h-6"
                        />
                        <span className="font-semibold text-lg">MY-NFC</span>
                    </div>
                </div>

                <div className="mt-2 inline-flex items-center gap-3 bg-white/70 backdrop-blur px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-slate-700 font-semibold">
                        Science ID:
                    </span>
                    <span className="text-slate-900 text-xl font-bold tracking-wider">
                        BNV-0125-0002
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-[160px_1fr] gap-5">
                    <div className="relative">
                        <div className="aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white">
                            <img
                                src={DefaultAvatar}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <img
                            src={VerifyIcon}
                            alt="verify"
                            className="absolute -bottom-2 -right-2 w-8 h-8"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        <div className="space-y-1">
                            <div className="text-slate-500">Familiyasi</div>
                            <div className="text-xl font-semibold text-slate-900">
                                ISMOILOV
                            </div>

                            <div className="text-slate-500">Ismi</div>
                            <div className="text-xl font-semibold text-slate-900">
                                DUSTMUROD
                            </div>

                            <div className="text-slate-500">Otasining ismi</div>
                            <div className="text-xl font-semibold text-slate-900">
                                G'AYBULLA O'G'LI
                            </div>

                            <div className="text-slate-500">Ilmiy darajasi</div>
                            <div className="text-xl font-semibold text-slate-900">
                                PhD
                            </div>

                            <div className="text-slate-500">Ilmiy unvoni</div>
                            <div className="text-xl font-semibold text-slate-900">
                                Yo'q
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="text-slate-500">
                                    Tug'ilgan sanasi
                                </div>
                                <div className="text-lg font-semibold text-slate-900">
                                    22.02.1999
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-500">
                                    Ro'yxatdan o'tgan sana
                                </div>
                                <div className="text-lg font-semibold text-slate-900">
                                    02 / 06 /2024
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-1 right-4 text-4xl font-semibold tracking-wide text-slate-600/80 select-none">
                    SCIENCE ID
                </div>
            </div>
        </div>
    );
}

export default FrontCard;
