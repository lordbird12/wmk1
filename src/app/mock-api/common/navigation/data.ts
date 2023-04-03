/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'g-Admin',
        title: 'บัญชีธนาคารวัด',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:home',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'bank',
                title: 'บัญชีธนาคาร',
                type: 'collapsable',
                icon: 'mat_solid:money',
                // link: '/user/list',
                children: [
                    {
                        title: 'รายชื่อบัญชีธนาคาร',
                        type: 'basic',
                       
                        link: '/bank/list',
                        hidden: function () {
                            return AuthService._menu1; // must be a boolean value
                        },
                    },
                    {
                        title: 'สร้างบัญชีธนาคาร',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/bank/new-bank',
                        hidden: function () {
                            return AuthService._menu2; // must be a boolean value
                        },
                    },
                    {
                        title: 'สิทธิ์การใช้งาน',
                        type: 'basic',
                        hidden: function () {
                            return AuthService._admin; // must be a boolean value
                        },
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/bank/permission',
                    },
                ],
            },
            {
                id: 'deposit-withdraw',
                title: 'ธุรกรรมทางการเงิน',
                type: 'collapsable',
                icon: 'mat_solid:attach_money',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการธุรกรรม',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/bank/list-deposit',
                        hidden: function () {
                            return AuthService._menu3; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-deposit',
                        title: 'เพิ่มรายการรับเข้า',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/bank/new-bank-deposit',
                        hidden: function () {
                            return AuthService._menu4; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-withdraw',
                        title: 'เพิ่มรายการเบิกออก',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/bank/new-bank-withdraw',
                        hidden: function () {
                            return AuthService._menu5; // must be a boolean value
                        },
                    },
                ],
            },
            // {
            //     id: 'withdraw',
            //     title: 'ถอนเงิน',
            //     type: 'collapsable',
            //     // icon: 'heroicons_outline:clipboard-check',
            //     // link: '/user/list',
            //     children: [
            //         {
            //             id: 'list',
            //             title: 'รายการถอนเงิน',
            //             type: 'basic',
            //             // icon: 'heroicons_outline:clipboard-check',
            //             link: '/bank/list-withdraw',
            //         },
            //         {
            //             id: 'new-withdraw',
            //             title: 'เพิ่มหน้าถอนเงิน',
            //             type: 'basic',
            //             // icon: 'heroicons_outline:clipboard-check',
            //             link: '/bank/new-bank-withdraw',
            //         },

            //     ]
            // },
        ],
    },

    {
        id: 'admin',
        title: 'ผู้จัดการระบบ',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:users',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'user',
                title: 'ผู้ใช้งาน',
                type: 'collapsable',
                
                
                    icon: 'mat_solid:emoji_people',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายชื่อผู้ใช้งาน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/user/list',
                        hidden: function () {
                            return AuthService._menu6; // must be a boolean value
                        },
                    },
                    {
                        id: 'create-user',
                        title: 'สร้างผู้ใช้งาน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/user/create-user',
                        hidden: function () {
                            return AuthService._menu7; // must be a boolean value
                        },
                    },
                    {
                        id: 'position',
                        title: 'ตำแหน่ง',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                        hidden: function () {
                            return AuthService._menu8; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายการตำแหน่ง',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/position/list',
                            },
                            {
                                id: 'new-position',
                                title: 'สร้างตำแหน่ง',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/position/new-position',
                            },
                        ],
                    },
                    {
                        id: 'department',
                        title: 'แผนก',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                        hidden: function () {
                            return AuthService._menu9; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายการแผนก',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/department/list',
                            },
                            {
                                id: 'new-department',
                                title: 'สร้างแผนก',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/department/new-department',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'menu',
                title: 'สิทธิ์การใช้งานเมนู',
                type: 'basic',
                icon: 'checklist_rtl',
                link: '/menu/list',
                hidden: function () {
                    return AuthService._admin; // must be a boolean value
                },
            },
            {
                id: 'monk',
                title: 'พระ',
                type: 'collapsable',
                icon: 'nature_people',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการพระ',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/monk/list',
                        hidden: function () {
                            return AuthService._menu10; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-location',
                        title: 'สร้างพระ',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/monk/new-monk',
                        hidden: function () {
                            return AuthService._menu11; // must be a boolean value
                        },
                    },
                    {
                        id: 'group-monk',
                        title: 'จัดกลุ่มพระ',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                        hidden: function () {
                            return AuthService._menu12; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายการจัดกลุ่มพระ',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/group-monk/list',
                            },
                            {
                                id: 'new-group-monk',
                                title: 'สร้างกลุ่มพระ',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/group-monk/new-group-monk',
                            },
                            {
                                id: 'new-group-monk',
                                title: 'เพิ่มพระเข้ากลุ่ม',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/group-monk/new-monk-group',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'sala',
                title: 'ศาลา',
                type: 'collapsable',
                icon: 'feather:home',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายชื่อศาลา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/sala/list',
                        hidden: function () {
                            return AuthService._menu13; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-sala',
                        title: 'สร้างศาลา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/sala/new-sala',
                        hidden: function () {
                            return AuthService._menu14; // must be a boolean value
                        },
                    },
                    {
                        id: 'list-reserve',
                        title: 'รายชื่อจองศาลา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/sala/list-reserve',
                        hidden: function () {
                            return AuthService._menu15; // must be a boolean value
                        },
                    },
                    {
                        id: 'reserve-sala',
                        title: 'จองศาลา',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/sala/reserve-sala',
                        hidden: function () {
                            return AuthService._menu16; // must be a boolean value
                        },
                    },
                ],
            },
            {
                id: 'member',
                title: 'สมาชิก',
                type: 'collapsable',
                icon: 'mat_solid:people_alt',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายชื่อสมาชิก',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/member/list',
                        hidden: function () {
                            return AuthService._menu17; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-position',
                        title: 'เพิ่มสมาชิก',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/member/new-member',
                        hidden: function () {
                            return AuthService._menu18; // must be a boolean value
                        },
                    },
                ],
            },
            {
                id: 'location',
                title: 'ห้องเก็บอุปกรณ์',
                type: 'collapsable',
                icon: 'heroicons_outline:lock-closed',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการห้องเก็บอุปกรณ์',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/location/list',
                        hidden: function () {
                            return AuthService._menu19; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-location',
                        title: 'สร้างห้องเก็บอุปกรณ์',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/location/new-location',
                        hidden: function () {
                            return AuthService._menu20; // must be a boolean value
                        },
                    },
                ],
            },
            {
                id: 'item',
                title: 'อุปกรณ์',
                type: 'collapsable',
                icon: 'mat_outline:rice_bowl',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการอุปกรณ์',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/item/list',
                        hidden: function () {
                            return AuthService._menu21; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-location',
                        title: 'สร้างอุปกรณ์ใหม่',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/item/new-item',
                        hidden: function () {
                            return AuthService._menu22; // must be a boolean value
                        },
                    },
                ],
            },
        ],
    },
    {
        id: 'news',
        title: 'จัดการข่าว',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:view-grid',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'news',
                title: 'ข่าวสาร',
                type: 'collapsable',
                icon: 'heroicons_outline:newspaper',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการข่าว',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/news/list',
                        hidden: function () {
                            return AuthService._menu23; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-news',
                        title: 'เพิ่มข่าวใหม่',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/news/new-news',
                        hidden: function () {
                            return AuthService._menu24; // must be a boolean value
                        },
                    },
                    {
                        id: 'category-news',
                        title: 'หมวดหมู่ข่าว',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                         hidden: function () {
                            return AuthService._menu25; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายชื่อหมวดหมู่',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/news/list-category-news',
                            },
                            {
                                id: 'new-category-news',
                                title: 'เพิ่มข่าวใหม่',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/news/new-category-news',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'gallery',
        title: 'จัดการแกลลอรี่',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:view-grid',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'gallery',
                title: 'แกลลอรี่',
                type: 'collapsable',
                icon: 'mat_outline:picture_as_pdf',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการแกลลอรี่',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/gallery/list',
                        hidden: function () {
                            return AuthService._menu26; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-gallery',
                        title: 'เพิ่มแกลลอรี่ใหม่',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/gallery/new-gallery',
                        hidden: function () {
                            return AuthService._menu27; // must be a boolean value
                        },
                    },
                    {
                        id: 'category-gallery',
                        title: 'หมวดหมู่แกลลอรี่',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                        hidden: function () {
                            return AuthService._menu28; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายชื่อหมวดหมู่',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/gallery/list-category-gallery',
                            },
                            {
                                id: 'new-category-gallery',
                                title: 'เพิ่มหมวดหมู่แกลลอรี่ใหม่',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/gallery/new-category-gallery',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'sacred',
        title: 'จัดการวัตถุมงคล',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:view-grid',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: '',
                title: 'วัตถุมงคล',
                type: 'collapsable',
                icon: 'heroicons_outline:sparkles',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการวัตถุมงคล',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/sacred/list',
                        hidden: function () {
                            return AuthService._menu29; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-sacred',
                        title: 'สร้างวัตถุมงคล',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/sacred/new-sacred',
                        hidden: function () {
                            return AuthService._menu30; // must be a boolean value
                        },
                    },
                ],
            },
        ],
    },
    {
        id: 'land',
        title: 'จัดการที่ดิน',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:view-grid',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'land',
                title: 'จัดการที่ดิน',
                type: 'collapsable',
                icon: 'feather:map',
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการที่ดิน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/land/list',
                        hidden: function () {
                            return AuthService._menu31; // must be a boolean value
                        },
                    },
                    {
                        id: 'new-land',
                        title: 'เพิ่มที่ดิน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/land/new',
                        hidden: function () {
                            return AuthService._menu32; // must be a boolean value
                        },
                    },
                    {
                        id: 'event-land',
                        title: 'จัดการกิจกรรมที่ดิน',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                        hidden: function () {
                            return AuthService._menu33; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายการกิจกรรมที่ดิน',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/event-land/list',
                            },
                            {
                                id: 'new-land',
                                title: 'เพิ่มกิจกรรมที่ดิน',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/event-land/new',
                            },
                        ],
                    },
                    {
                        id: 'rent-land',
                        title: 'จัดการเช่าที่ดิน',
                        type: 'collapsable',
                        // icon: 'heroicons_outline:clipboard-check',
                        // link: '/user/list',
                        hidden: function () {
                            return AuthService._menu34; // must be a boolean value
                        },
                        children: [
                            {
                                id: 'list',
                                title: 'รายการเช่าที่ดิน',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/rent-land/list',
                            },
                            {
                                id: 'new-land',
                                title: 'เพิ่มกิจกรรมเช่าที่ดิน',
                                type: 'basic',
                                // icon: 'heroicons_outline:clipboard-check',
                                link: '/rent-land/new',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: 'stock',
        title: 'สต๊อก',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:view-grid',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'stock-deposit',
                title: 'ยืมอุปกรณ์',
                type: 'collapsable',
                icon: 'mat_outline:handyman',
   
                // link: '/user/list',
                children: [
                    {
                        id: 'list',
                        title: 'รายการยืมอุปกรณ์',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/deposit/list',
                        hidden: function () {
                            return AuthService._menu35; // must be a boolean value
                        },
                    },
                    {
                        id: 'create-user',
                        title: 'สร้างผู้ใช้งาน',
                        type: 'basic',
                        // icon: 'heroicons_outline:clipboard-check',
                        link: '/deposit/new-deposit',
                        hidden: function () {
                            return AuthService._menu36; // must be a boolean value
                        },
                    },
                ],
            },
        ],
    },


    {
        id: 'website',
        title: 'เว็บไซต์',
        // subtitle: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:view-grid',
        // hidden: function () {
        //     return AuthService._marketingRole; // must be a boolean value
        // },
        children: [
            {
                id: 'stock-deposit',
                title: 'จัดการเว็ปไซต์',
                type: 'collapsable',
                icon: 'feather:edit',
                // link: '/user/list',
                children: [
                    {
                        id: 'banner',
                        title: 'แบนเนอร์',
                        type: 'basic',
                        link: '/banner/list',
                    },
                    {
                        id: 'single-banner',
                        title: 'แบนเนอร์เดี่ยว',
                        type: 'basic',
                        link: '/single-banner/list',
                    }, 
                    {
                        id: 'category',
                        title: 'หมวดหมู่คอร์ส',
                        type: 'basic',
                        link: '/category/list',
                    },
                    {
                        id: 'gallery',
                        title: 'แกลลอลี่',
                        type: 'basic',
                        link: '/gallery/list',
                    },
                    {
                        id: 'line',
                        title: 'Line',
                        type: 'basic',
                        link: '/line/list',
                    },
                    {
                        id: 'menu',
                        title: 'เมนู',
                        type: 'basic',
                        link: '/menu-customer/list',
                    },                   
                    {
                        id: 'menus',
                        title: 'เมนูหลัก',
                        type: 'basic',
                        link: '/menus/list',
                    },                   
                    {
                        id: 'product',
                        title: 'สินค้าทั้งหมด',
                        type: 'basic',
                        link: '/product/list',
                    },                   
                    {
                        id: 'product-category',
                        title: 'หมวดหมู่สินค้า',
                        type: 'basic',
                        link: '/product-category/list',
                    }, 
                    {
                        id: 'product-healty',
                        title: 'สินค้าเพื่อสุขภาพ',
                        type: 'basic',
                        link: '/product-healty/list',
                    }, 
                    {
                        id: 'product-main',
                        title: 'สินค้าหลัก',
                        type: 'basic',
                        link: '/product-main/list',
                    }, 
                    {
                        id: 'product-weight',
                        title: 'สินค้าเพื่อการลดน้ำหนัก',
                        type: 'basic',
                        link: '/product-weight/list',
                    }, 
                    {
                        id: 'profile',
                        title: 'โปรไฟล์',
                        type: 'basic',
                        link: '/profile/list',
                    }, 
                    {
                        id: 'review',
                        title: 'อัลบั้มรูปภาพ',
                        type: 'basic',
                        link: '/review/list',
                    }, 

                    // {
                    //     id: 'user',
                    //     title: 'ผู้ใช้',
                    //     type: 'basic',
                    //     link: '/user/list',
                    // }, 
                    // {
                    //     id: 'video',
                    //     title: 'วีดีโอ',
                    //     type: 'basic',
                    //     link: '/video/list',
                    // }, 
                    {
                        id: 'youtube',
                        title: 'รายการวีดีโอยูทูบ',
                        type: 'basic',
                        link: '/youtube/list',
                    }, 
                    {
                        id: 'youtube-best',
                        title: 'รายการวีดีโอยูทูบสินค้าขายดี',
                        type: 'basic',
                        link: '/youtube-best/list',
                    },                   



                ],
            },
        ],
    },


    {
        id: 'account',
        title: 'บัญชีผู้ใช้',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'settings',
                title: 'โปรไฟล์',
                type: 'basic',
                icon: 'feather:user',
                link: '/user/profile',
            },
            {
                id: 'user-signout',
                title: 'ออกจากระบบ',
                type: 'basic',
                icon: 'exit_to_app',
                
                link: '/sign-out',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        type: 'group',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Misc',
        type: 'group',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
