import frontCardImage from '../assets/images/frontImage.svg';
import verify from '../assets/icons/verify.svg';
import defaultAvatar from '../assets/images/defoultImage.jpg';
import moment from 'moment';

function FrontCard() {
    return (
        <div className="mx-auto">
            <div className="relative rounded-[8px] w-[400px] h-[250px] overflow-hidden">
                <img
                    src={frontCardImage}
                    alt="Front Card"
                    className="w-[400px] h-[250px]"
                />
                <div className="w-[400px] h-[250px] absolute top-0 left-0 flex flex-col ml-[12px]">
                    {/* Science ID */}
                    <div className="mt-[55px]">
                        <div className="bg-[#8DAAD433] rounded-md p-0.5 inline-flex items-center justify-center">
                            <div className="italic text-[9px] text-[#2b2e33]">
                                Science ID:
                            </div>
                            <div className="text-[10px] font-semibold ml-1 text-[#000]">
                                MMM-0000-0000
                            </div>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center mt-[2px]">
                        <div className="flex items-center justify-center">
                            <div className="border border-[#6D88B1] rounded-[2px] w-[100px] h-[130px] flex items-center justify-center relative">
                                <img
                                    src={defaultAvatar}
                                    className="w-[98px] h-[128px] object-cover rounded-[2px]"
                                    alt="Avatar"
                                />
                                <img
                                    src={verify}
                                    className="w-[12px] h-[12px] absolute bottom-[6px] right-[3px]"
                                    alt="Verify"
                                />
                            </div>
                            <div className="flex flex-col ml-[10px]">
                                <div className="flex flex-col">
                                    <div className="text-[9px] text-[#2b2e33] italic">
                                        Familiyasi
                                    </div>
                                    <div className="text-[10px] font-semibold text-[#000]">
                                        IKROMOV
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[9px] text-[#2b2e33] italic">
                                        Ismi
                                    </div>
                                    <div className="text-[10px] font-semibold text-[#000]">
                                        AKROM
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[9px] text-[#2b2e33] italic">
                                        Otasining ismi
                                    </div>
                                    <div className="text-[10px] font-semibold text-[#000]">
                                        MURODOVICH
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[9px] text-[#2b2e33] italic">
                                        Ilmiy darajasi
                                    </div>
                                    <div className="text-[10px] font-semibold text-[#000]">
                                        PhD
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[9px] text-[#2b2e33] italic">
                                        Ilmiy unvoni
                                    </div>
                                    <div className="text-[10px] font-semibold text-[#000]">
                                        Professor
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col ml-[28px] mt-[-30px]">
                            <div className="flex flex-col">
                                <div className="text-[9px] text-[#535862] italic">
                                    Tug'ilgan sanasi
                                </div>
                                <div className="text-[10px] font-semibold text-[#000]">
                                    {moment('2000-01-01').format(
                                        'DD.MM.YYYY'
                                    ) ?? "Yo'q"}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-[9px] text-[#535862] italic">
                                    Ro'yxatdan o'tgan sana
                                </div>
                                <div className="text-[10px] font-semibold text-[#000]">
                                    {moment('2025-01-01').format(
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
