const menuContainer = document.getElementById('main_menu');
let menuData = [];


fetch('asset/menu.json')
    .then(response => response.json())
    .then(data => {
        menuData = data.menu; // เก็บข้อมูลในตัวแปร menuData
        // console.log('Loaded Menu Data:', menuData);

    render(menuData)
    });

function render (menuData, category = 'all_menu') {

    menuContainer.innerHTML = ''; 

    const filteredMenu = category === 'all_menu'
    ? menuData // ถ้า category เป็น 'all_menu' ให้แสดงทั้งหมด
    : menuData.filter(item => item.category === category);

    filteredMenu.forEach(item => {

        const menuItem = document.createElement('div');
        menuItem.className = 'box';

        const menuImage = document.createElement('img');
        menuImage.src = item.path; // ใช้ path ของรูปภาพจาก JSON
        menuImage.alt = item.ENname;

        const menuENTitle = document.createElement('h4');
        menuENTitle.textContent = item.ENname;

        const menuTHTitle = document.createElement('h4');
        menuTHTitle.textContent = item.THname;

        menuItem.appendChild(menuImage);
        menuItem.appendChild(menuENTitle);
        menuItem.appendChild(menuTHTitle);
        menuContainer.appendChild(menuItem);

        menuItem.addEventListener("click", () => {
            document.querySelector('#add-remove-modal-menu h5').innerHTML = 1
            modal = document.getElementById('myModal');
            modal.style.display = "block";
            modal_menu_info = document.getElementById('modal-menu-info');
            modal_menu_info.innerHTML = '';
            modal_menu_info.innerHTML = `<h4>${item.ENname}</h4>
                                         <h4>${item.THname}</h4>
                                         <div class="box modal-box">
                                             <img src="${item.path}" alt="${item.ENname}">
                                         </div>
                                         <div class="menu-size" id="menu-size">
                                            <div>
                                                <button id="size-s" class="sizebox size-active"><i class="fa-solid fa-s"></i></button>
                                                <h5>เล็ก</h5>
                                            </div>
                                            <div>
                                                <button id="size-m" class="sizebox"><i class="fa-solid fa-m"></i></button>
                                                <h5>กลาง</h5>
                                            </div>
                                            <div>
                                                <button id="size-l" class="sizebox"><i class="fa-solid fa-l"></i></button>
                                                <h5>ใหญ่</h5>
                                            </div>
                                         </div>`;
            
            // ตั้งค่า visibility ของ size (กรณีไม่มี size)
            const menu_size = document.getElementById('menu-size');
            menu_size.style.display = item.size === "true" ? "flex" : "none";

            const size_buttons = menu_size.querySelectorAll('.sizebox');
            size_buttons.forEach(button => button.classList.remove('size-active'));
            document.getElementById('size-s').classList.add('size-active');


            size_buttons.forEach(button => {
            button.addEventListener('click', () => {
                size_buttons.forEach(btn => btn.classList.remove('size-active'));
                button.classList.add('size-active');
                });
            });                   
            

            // จัดการ Event ยืนยันคำสั่ง
            const modal_confirm_order = document.getElementById('modal-confirm-order');
            
            // ลบ Event Listener เก่าก่อนเพิ่มใหม่
            const newConfirmHandler = () => {
                var quantity_order = parseInt(document.querySelector('#add-remove-modal-menu h5').textContent, 10);
                const activeSizeButton = menu_size.querySelector('.sizebox.size-active'); // หาปุ่มที่มีคลาส size-active
                const sizeText = activeSizeButton ? activeSizeButton.parentElement.querySelector('h5').textContent : null;

                
                // console.log(`Selected Size: ${activeSize.id}, ${item.ENname}`);
                const selectedMenu = {
                    ENname: item.ENname,
                    THname: item.THname,
                    path: item.path,
                    size: sizeText,
                    quantity: quantity_order,
                }
                
                

                modal.style.display = "none";

                // ดึงข้อมูลเก่าและเพิ่มข้อมูลใหม่
                const existingMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];
                const existingMenu = existingMenus.find(menu => menu.ENname === selectedMenu.ENname);
                if (existingMenu && existingMenu.size == sizeText) {
                    // ถ้ามีเมนูนั้นอยู่แล้ว เพิ่มจำนวน
                    existingMenu.quantity += quantity_order;
                } else {
                    // ถ้าไม่มีเมนูนั้น เพิ่มเมนูใหม่
                    existingMenus.push(selectedMenu);
                }
                

                // อัปเดตกลับไปที่ Session Storage
                sessionStorage.setItem('selectedMenus', JSON.stringify(existingMenus));

                
            };
        
            // ลบ Event Listener ที่อาจมีอยู่ก่อน
            modal_confirm_order.removeEventListener('click', modal_confirm_order._handler || (() => {}));

            // เพิ่ม Event Listener ใหม่
            modal_confirm_order.addEventListener('click', newConfirmHandler);
        
            // เก็บ handler ใหม่ไว้ในตัวแปร _handler เพื่อใช้งานใน removeEventListener ครั้งต่อไป
            modal_confirm_order._handler = newConfirmHandler;
              
            

                                         
        })
    });

}



const h5Element = document.querySelector('#add-remove-modal-menu h5');
const removeButton = document.getElementById('remove-order');
const addButton = document.getElementById('add-order');

// ฟังก์ชันลบจำนวน
removeButton.addEventListener('click', () => {
    let currentValue = parseInt(h5Element.textContent, 10); // ดึงค่าปัจจุบันของ h5
    if (currentValue > 1) {
        h5Element.textContent = currentValue - 1; // ลดค่าลง 1
        // console.log('Current Value:', currentValue - 1);
    }
});

// ฟังก์ชันเพิ่มจำนวน
addButton.addEventListener('click', () => {
    let currentValue = parseInt(h5Element.textContent, 10); // ดึงค่าปัจจุบันของ h5
    h5Element.textContent = currentValue + 1; // เพิ่มค่าขึ้น 1
    // console.log('Current Value:', currentValue + 1);
});






// button show menu with category

category_button = document.getElementById('left_menu');
category_button.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button && button.classList.contains('btn_menu')) {
        const category_menu = button.getAttribute('data-category');
        render(menuData, category_menu)
    }
    
})



// open modal content

// var modal = document.getElementById("myModal");

// // Get the button that opens the modal

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on the button, open the modal
// // btn.onclick = function() {
// //   modal.style.display = "block";
// // }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

document.addEventListener('click', (event) => {
    // เช็คว่า target เป็น .close หรือไม่
    if (event.target.classList.contains('close') || event.target.classList.contains('remove-order-menu')) {
        const modal = document.getElementById('myModal'); // หรือ element modal ที่ต้องการปิด
        modal.style.display = "none"; // ซ่อน modal
    }
});

// size active


    

