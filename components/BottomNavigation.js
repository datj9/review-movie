import Link from "next/link";

export default function BottomNavigation() {
    return (
        <ul className='bottom-nav'>
            <li className='nav-item'>Phim</li>
            <li className='nav-item'>Rạp Chiếu</li>
            <li className='nav-item'>Gần Đây</li>
            <li className='nav-item'>Tài Khoản</li>
        </ul>
    );
}
