
const my_order_container = document.getElementById('all-my-order');



document.addEventListener('DOMContentLoaded', () => {
    // ดึงข้อมูลจาก Session Storage
    const selectedMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];
    selectedMenus.forEach(menu => render_myorder(menu));   
    
});
 
 

function render_myorder(selectedMenu) {
    my_order_container.innerHTML += `
        <li>
            <div class="list_order">
                <img src="${selectedMenu.path}" alt="${selectedMenu.ENname}">
                <div class="order_container">
                    <h5>${selectedMenu.ENname}</h5>
                    <h5>${selectedMenu.THname}</h5>
                    <h5 class="myorder-size">ขนาด${selectedMenu.size}</h5>
                    <div class="add-remove add-remove-myorder" >
                        <button class="remove"><i class="fa-solid fa-minus"></i></button>
                        <h5>${selectedMenu.quantity}</h5>
                        <button class="add"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <span class="close remove-order-menu">&times;</span>
            </div>
        </li>`;
}



// ใช้ Event Delegation
my_order_container.addEventListener('click', (event) => {
    // ตรวจสอบว่าผู้ใช้คลิกที่ปุ่ม close หรือไม่
    const target = event.target;

    // ดึงข้อมูลจาก sessionStorage
    const selectedMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];
    
    // ตรวจสอบว่าคลิกที่ปุ่ม remove
    if (target.closest('.remove')) {
        const addRemoveElement = target.closest('.add-remove');
        const quantityElement = addRemoveElement.querySelector('h5');
        let currentValue = parseInt(quantityElement.textContent, 10);
    
        if (currentValue > 1) {
            quantityElement.textContent = currentValue - 1;
        
            // อัปเดต sessionStorage
            const menuName = addRemoveElement.closest('.list_order').querySelector('h5').textContent;
            const menuIndex = selectedMenus.findIndex(menu => menu.ENname === menuName);
        
            if (menuIndex !== -1) {
                selectedMenus[menuIndex].quantity -= 1;
                sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
            }
        }
    }
    
    // ตรวจสอบว่าคลิกที่ปุ่ม add
    if (target.closest('.add')) {
        const addRemoveElement = target.closest('.add-remove');
        const quantityElement = addRemoveElement.querySelector('h5');
        let currentValue = parseInt(quantityElement.textContent, 10);
    
        quantityElement.textContent = currentValue + 1;
    
        // อัปเดต sessionStorage
        const menuName = addRemoveElement.closest('.list_order').querySelector('h5').textContent;
        const menuIndex = selectedMenus.findIndex(menu => menu.ENname === menuName);
    
        if (menuIndex !== -1) {
            selectedMenus[menuIndex].quantity += 1;
            sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
        }
    }
    
    // ตรวจสอบว่าคลิกที่ปุ่ม remove-order-menu
    if (target.classList.contains('remove-order-menu')) {
        const listItem = target.closest('li'); // หา <li> ที่เกี่ยวข้องกับปุ่มนี้
        if (listItem) {
            const menuName = listItem.querySelector('.order_container h5').textContent;
        
            // ลบเมนูออกจาก sessionStorage
            const menuIndex = selectedMenus.findIndex(menu => menu.ENname === menuName);
            if (menuIndex !== -1) {
                selectedMenus.splice(menuIndex, 1);
                sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
            }
        
            // ลบ <li> ออกจาก DOM
            listItem.remove();
        }
    }

});






const socket = io('http://localhost:3000')
function sendOrdering() {
    const selectedMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];
        // console.log(selectedMenus); // Log the selectedMenus data
    if (selectedMenus.length > 0) {
        socket.emit('order', selectedMenus)
        
        my_order_container.innerHTML = '';
        sessionStorage.clear();
    } else {
        alert("ไม่มีรายการอาหารที่สั่ง")
    }
    
        
               
}