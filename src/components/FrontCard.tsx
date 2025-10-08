import frontCardImage from '../assets/images/frontImage.svg';
import verify from '../assets/icons/verify.svg';
import defaultAvatar from '../assets/images/default-avatar.png';
import moment from 'moment';

function FrontCard() {
    return (
        <div className="mx-auto">
            <div className="relative rounded-[8px] w-[450px] h-[280px] overflow-hidden">
                <img
                    src={frontCardImage}
                    alt="Front Card"
                    className="w-[450px] h-[280px]"
                />
                <div className="w-[450px] h-[280px] absolute top-0 left-0 flex flex-col ml-[15px]">
                    {/* Science ID */}
                    <div className="mt-[65px]">
                        <div className="bg-[#8DAAD433] rounded-md p-1 inline-flex items-center justify-center">
                            <div className="italic text-[11px] text-[#2b2e33]">
                                Science ID:
                            </div>
                            <div className="text-[12px] font-semibold ml-1 text-[#000]">
                                MMM-0000-0000
                            </div>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center mt-[px]">
                        <div className="flex items-center justify-center">
                            <div className="border border-[#6D88B1] rounded-[2px] w-[114px] h-[148px] flex items-center justify-center relative">
                                <img
                                    src={defaultAvatar}
                                    className="w-[112px] h-[146px] object-cover rounded-[2px]"
                                    alt="Avatar"
                                />
                                <img
                                    src={verify}
                                    className="w-[14px] h-[14px] absolute bottom-[8px] right-[4px]"
                                    alt="Verify"
                                />
                            </div>
                            <div className="flex flex-col ml-[12px]">
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#2b2e33] italic">
                                        Familiyasi
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        ISMOILOV
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#2b2e33] italic">
                                        Ismi
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        DUSTMUROD
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#2b2e33] italic">
                                        Otasining ismi
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        G‘AYBULLA O‘G‘LI
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#2b2e33] italic">
                                        Ilmiy darajasi
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        PhD
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[11px] text-[#2b2e33] italic">
                                        Ilmiy unvoni
                                    </div>
                                    <div className="text-[12px] font-semibold text-[#000]">
                                        Professor
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col ml-[35px] mt-[-35px]">
                            <div className="flex flex-col">
                                <div className="text-[11px] text-[#535862] italic">
                                    Tug'ilgan sanasi
                                </div>
                                <div className="text-[12px] font-semibold text-[#000]">
                                    {moment('1990-01-01').format(
                                        'DD.MM.YYYY'
                                    ) ?? "Yo'q"}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-[11px] text-[#535862] italic">
                                    Ro'yxatdan o'tgan sana
                                </div>
                                <div className="text-[12px] font-semibold text-[#000]">
                                    {moment('2021-01-01').format(
                                        'DD.MM.YYYY'
                                    ) ?? "Yo'q"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FrontCard;
