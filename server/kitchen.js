const socket = io('http://localhost:3000')



var display_order = document.querySelector('#display_order')
var html = '';
var count = 0;

socket.on('kitchen', (response) => {

    
    if (Array.isArray(response)) {
        const selectedMenus = response.map(item => {
            return item; 
        });
        sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
    }
    
    // โหลดข้อมูลจาก sessionStorage และใช้
    const storedMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];
    console.log(storedMenus);
    count++;

    html += `<li>
                <div class="order_box">
                    <h4>table 1 </h4>
                    <h4>order ${count}</h4>
                    <ul>`;

    storedMenus.forEach(menu => {
        html += `<li>
                    <div class="order_table">
                        <img src="../client/${menu.path}" alt="${menu.ENname}">
                        <div class="menu_name">
                            <h4>${menu.ENname}</h4>
                            <h4>${menu.THname}</h4>
                        </div>
                        <div class="count_and_size">
                            <h4>ขนาด <span class="order_size">${menu.size}</span></h4>
                            <h4>จำนวน <span class="order_count">${menu.quantity}</span> ถาด</h4>
                        </div>
                        <button class="btn_confirm_prepar">ยืนยันคำสั่ง</button>
                    </div>
                </li>`;
    });
    html += `</ul><button id="confirm_serve">ยืนยันเสิร์ฟอาหาร</button></div></li>`;

            display_order.innerHTML = html;
})

