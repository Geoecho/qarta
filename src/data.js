import { Coffee, Croissant, Sunrise, Snowflake, Wine, Beer, Martini, Soup, Pizza, Salad, IceCream, ChefHat, Utensils, GlassWater } from 'lucide-react';

export const MENU_DATA = [
    {
        id: 'drinks',
        label: { en: 'Coffee & Beverages', mk: 'Кафе и безалкохолни пијалоци', sq: 'Kafe & Pije' },
        icon: Coffee,
        sections: [
            {
                id: 'coffee',
                title: { en: 'Coffee', mk: 'Кафе', sq: 'Kafe' },
                icon: Coffee,
                items: [
                    {
                        id: 'd1',
                        name: { en: 'Double Espresso', mk: 'Дупло Еспресо' },
                        price: 4.50,
                        desc: { en: 'Direct trade beans, notes of chocolate & cherry.', mk: 'Директна трговија, ноти на чоколадо и цреша.' },
                        image: 'https://images.unsplash.com/photo-1510591509098-f40718147d43?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'd1b',
                        name: { en: 'Cappuccino', mk: 'Капучино' },
                        price: 5.00,
                        desc: { en: 'Double espresso, steamed milk, foam.', mk: 'Дупло еспресо, парено млеко, пена.' },
                        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=200',
                        options: [
                            { id: 'oat', label: { en: 'Oat', mk: 'Овесно', sq: 'Tërshërë' }, price: 0.5 },
                            { id: 'soy', label: { en: 'Soy', mk: 'Соја', sq: 'Soje' }, price: 0.5 },
                            { id: 'almond', label: { en: 'Almond', mk: 'Бадем', sq: 'Bajame' }, price: 0.5 }
                        ]
                    },
                    {
                        id: 'd2',
                        name: { en: 'Flat White', mk: 'Флет Вајт' },
                        price: 5.50,
                        desc: { en: 'Silky steamed milk poured over double shot.', mk: 'Свиленкасто млеко врз дупло еспресо.' },
                        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=200',
                        options: [
                            { id: 'oat', label: { en: 'Oat', mk: 'Овесно', sq: 'Tërshërë' }, price: 0.5 },
                            { id: 'soy', label: { en: 'Soy', mk: 'Соја', sq: 'Soje' }, price: 0.5 },
                            { id: 'almond', label: { en: 'Almond', mk: 'Бадем', sq: 'Bajame' }, price: 0.5 }
                        ]
                    },
                    {
                        id: 'd3',
                        name: { en: 'Matcha Latte', mk: 'Мача Лате' },
                        price: 6.00,
                        desc: { en: 'Ceremonial grade matcha, steamed milk.', mk: 'Церемонијална мача, парено млеко.' },
                        image: 'https://images.unsplash.com/photo-1515823664972-6d574b9b3a26?auto=format&fit=crop&q=80&w=200',
                        options: [
                            { id: 'oat', label: { en: 'Oat', mk: 'Овесно', sq: 'Tërshërë' }, price: 0.5 },
                            { id: 'soy', label: { en: 'Soy', mk: 'Соја', sq: 'Soje' }, price: 0.5 },
                            { id: 'almond', label: { en: 'Almond', mk: 'Бадем', sq: 'Bajame' }, price: 0.5 }
                        ]
                    },
                ]
            },
            {
                id: 'hot-drinks',
                title: { en: 'Hot Drinks', mk: 'Топли Пијалоци', sq: 'Pije të nxehta' },
                icon: Coffee,
                items: [
                    {
                        id: 'hd1',
                        name: { en: 'Hot Chocolate', mk: 'Топло Чоколадо' },
                        price: 5.00,
                        desc: { en: 'Rich belgian chocolate, whipped cream.', mk: 'Богато белгиско чоколадо, шлаг.' },
                        image: 'https://images.unsplash.com/photo-1542483238-510582777309?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'hd2',
                        name: { en: 'Salep', mk: 'Салеп' },
                        price: 4.00,
                        desc: { en: 'Traditional orchid root drink, cinnamon.', mk: 'Традиционален пијалок од орхидеја, цимет.' },
                        image: 'https://images.unsplash.com/photo-1515442261605-65987783cb4a?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'hd3',
                        name: { en: 'Nescafe', mk: 'Нескафе' },
                        price: 3.50,
                        desc: { en: 'Classic instant coffee, milk foam.', mk: 'Класично инстант кафе, пена од млеко.' },
                        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'soft-drinks',
                title: { en: 'Soft Drinks', mk: 'Сокови', sq: 'Pije Freskuese' },
                icon: GlassWater,
                items: [
                    {
                        id: 'sd1',
                        name: { en: 'Coca Cola', mk: 'Кока Кола' },
                        price: 3.00,
                        desc: { en: 'Original taste, 330ml.', mk: 'Оригинален вкус, 0.33л.' },
                        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'sd2',
                        name: { en: 'Fanta', mk: 'Фанта' },
                        price: 3.00,
                        desc: { en: 'Orange flavor, 330ml.', mk: 'Вкус на портокал, 0.33л.' },
                        image: 'https://images.unsplash.com/photo-1624696986628-98e3b79ce424?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'sd3',
                        name: { en: 'Sprite', mk: 'Спрајт' },
                        price: 3.00,
                        desc: { en: 'Lemon-lime, 330ml.', mk: 'Лимон-лимета, 0.33л.' },
                        image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'cold-brew',
                title: { en: 'Cold Brew', mk: 'Ладно Кафе' },
                icon: Snowflake,
                items: [
                    {
                        id: 'd4',
                        name: { en: 'Iced Americano', mk: 'Ледено Американо' },
                        price: 4.00,
                        desc: { en: 'Double shot over ice and filtered water.', mk: 'Дупло еспресо врз мраз и филтрирана вода.' },
                        image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'd5',
                        name: { en: 'Nitro Cold Brew', mk: 'Нитро Ладно Кафе' },
                        price: 5.00,
                        desc: { en: 'Steeped for 24h. Infused with nitrogen.', mk: 'Отстојано 24ч. Инфузирано со азот.' },
                        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    },
    {
        id: 'alcoholic',
        label: { en: 'Bar', mk: 'Бар', sq: 'Bar' },
        icon: Martini,
        sections: [
            {
                id: 'cocktails',
                title: { en: 'Cocktails', mk: 'Коктели', sq: 'Kokteje' },
                icon: Martini,
                filters: [
                    { id: 'all', label: { en: 'All', mk: 'Сите', sq: 'Të gjitha' } },
                    { id: 'classic', label: { en: 'Classic', mk: 'Класични' } },
                    { id: 'mocktail', label: { en: 'No Alcohol', mk: 'Без Алкохол' } }
                ],
                items: [
                    {
                        id: 'alc1',
                        tag: 'classic',
                        name: { en: 'Espresso Martini', mk: 'Еспресо Мартини' },
                        price: 14.00,
                        desc: { en: 'Vodka, coffee liqueur, fresh espresso.', mk: 'Вотка, ликер од кафе, свежо еспресо.' },
                        image: 'https://images.unsplash.com/photo-1628519592419-b57d6059da1e?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'alc2',
                        tag: 'classic',
                        name: { en: 'Negroni', mk: 'Негрони' },
                        price: 12.00,
                        desc: { en: 'Gin, Campari, Sweet Vermouth, Orange Peel.', mk: 'Џин, Кампари, Сладок Вермут, Кора од Портокал.' },
                        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'alc4',
                        tag: 'classic',
                        name: { en: 'Aperol Spritz', mk: 'Аперол Шприц' },
                        price: 11.00,
                        desc: { en: 'Aperol, Prosecco, Soda water, Orange slice.', mk: 'Аперол, Просеко, Кисела вода, Резанче портокал.' },
                        image: 'https://images.unsplash.com/photo-1560512823-8db965dfc530?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'mt1',
                        tag: 'mocktail',
                        name: { en: 'Virgin Mojito', mk: 'Вирџин Мохито' },
                        price: 8.00,
                        desc: { en: 'Fresh mint, lime juice, soda water, agave.', mk: 'Свежо нане, лимета, кисела вода, агава.' },
                        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'mt2',
                        tag: 'mocktail',
                        name: { en: 'Shirley Temple', mk: 'Ширли Темпл' },
                        price: 7.00,
                        desc: { en: 'Ginger ale, grenadine, maraschino cherry.', mk: 'Џинџер ејл, гренадин, мараскино цреша.' },
                        image: 'https://images.unsplash.com/photo-1536935338788-843bb528a472?auto=format&fit=crop&q=80&w=200'
                    }
                ]
            },
            {
                id: 'wine',
                title: { en: 'Wine List', mk: 'Винска Карта', sq: 'Lista e Verërave' },
                icon: Wine,
                filters: [
                    { id: 'all', label: { en: 'All', mk: 'Сите', sq: 'Të gjitha' } },
                    { id: 'red', label: { en: 'Red', mk: 'Црвено' } },
                    { id: 'white', label: { en: 'White', mk: 'Бело' } },
                    { id: 'sparkling', label: { en: 'Sparkling', mk: 'Пенливо' } }
                ],
                items: [
                    {
                        id: 'rw1',
                        tag: 'red',
                        name: { en: 'Cabernet Sauvignon', mk: 'Каберне Совињон' },
                        price: 12.00,
                        desc: { en: 'Napa Valley, 2019. Full bodied, dark fruit.', mk: 'Напа Вали, 2019. Полно тело, темно овошје.' },
                        image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'rw2',
                        tag: 'red',
                        name: { en: 'Pinot Noir', mk: 'Пино Ноар' },
                        price: 11.00,
                        desc: { en: 'Oregon, 2021. Light, fruity, earthy notes.', mk: 'Орегон, 2021. Лесно, овошно, земјени ноти.' },
                        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'ww1',
                        tag: 'white',
                        name: { en: 'Sauvignon Blanc', mk: 'Совињон Блан' },
                        price: 10.00,
                        desc: { en: 'Marlborough, NZ. Crisp acidity, citrus.', mk: 'Марлборо, НЗ. Крцкава киселост, цитруси.' },
                        image: 'https://images.unsplash.com/photo-1572569940026-c23f7c468c4a?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'ww2',
                        tag: 'white',
                        name: { en: 'Chardonnay', mk: 'Шардоне' },
                        price: 11.50,
                        desc: { en: 'Sonoma Coast. Oaky, buttery finish.', mk: 'Сонома. Дабово, путереста завршница.' },
                        image: 'https://images.unsplash.com/photo-1629243765163-f9382f7c0410?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'sw1',
                        tag: 'sparkling',
                        name: { en: 'Prosecco DOC', mk: 'Просеко' },
                        price: 9.00,
                        desc: { en: 'Veneto, Italy. Extra dry, refined bubbles.', mk: 'Венето, Италија. Екстра суво, фини меурчиња.' },
                        image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'whiskey',
                title: { en: 'Whiskey', mk: 'Виски', sq: 'Uiski' },
                icon: GlassWater,
                filters: [
                    { id: 'all', label: { en: 'All', mk: 'Сите', sq: 'Të gjitha' } },
                    { id: 'scotch', label: { en: 'Scotch', mk: 'Скоч' } },
                    { id: 'bourbon', label: { en: 'Bourbon', mk: 'Бурбон' } }
                ],
                items: [
                    {
                        id: 'wh1',
                        tag: 'scotch',
                        name: { en: 'Macallan 12', mk: 'Макалан 12' },
                        price: 18.00,
                        desc: { en: 'Sherry oak finish. Rich and spicy.', mk: 'Завршница од шери даб. Богато и зачинето.' },
                        image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'wh1b',
                        tag: 'scotch',
                        name: { en: 'Lagavulin 16', mk: 'Лагавулин 16' },
                        price: 22.00,
                        desc: { en: 'Islay. Intense peat smoke, sea salt.', mk: 'Ајлеј. Интензивен чад од тресет, морска сол.' },
                        image: 'https://images.unsplash.com/photo-1569529465841-dfecd07a6fcc?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'wh2',
                        tag: 'bourbon',
                        name: { en: 'Buffalo Trace', mk: 'Бафало Трејс' },
                        price: 10.00,
                        desc: { en: 'Kentucky Straight Bourbon. Caramel notes.', mk: 'Кентаки Бурбон. Ноти на карамела.' },
                        image: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'wh3',
                        tag: 'bourbon',
                        name: { en: 'Woodford Reserve', mk: 'Вудфорд Резерв' },
                        price: 12.00,
                        desc: { en: 'Kentucky Straight Bourbon. Dried fruit.', mk: 'Кентаки Бурбон. Суво овошје.' },
                        image: 'https://images.unsplash.com/photo-1595981266686-0cf387d0a608?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'beer',
                title: { en: 'Beer', mk: 'Пиво', sq: 'Birrë' },
                icon: Beer,
                filters: [
                    { id: 'all', label: { en: 'All', mk: 'Сите', sq: 'Të gjitha' } },
                    { id: 'domestic', label: { en: 'Domestic', mk: 'Домашно' } },
                    { id: 'imported', label: { en: 'Imported', mk: 'Увозно' } }
                ],
                items: [
                    {
                        id: 'b1',
                        tag: 'domestic',
                        name: { en: 'Local Lager', mk: 'Локален Лагер' },
                        price: 7.00,
                        desc: { en: 'Crisp, refreshing, 4.5% ABV.', mk: 'Крцкаво, освежително, 4.5% алк.' },
                        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'b2',
                        tag: 'imported',
                        name: { en: 'Hazy IPA', mk: 'ИПА' },
                        price: 8.00,
                        desc: { en: 'Juicy, citrusy, 6.8% ABV.', mk: 'Сочно, цитрусно, 6.8% алк.' },
                        image: 'https://images.unsplash.com/photo-1586993451228-0971c963603d?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'b3',
                        tag: 'imported',
                        name: { en: 'Stout', mk: 'Стаут' },
                        price: 8.00,
                        desc: { en: 'Dark, coffee notes, 5.5% ABV.', mk: 'Темно, ноти на кафе, 5.5% алк.' },
                        image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    },
    {
        id: 'starters',
        label: { en: 'Starters', mk: 'Предјадења', sq: 'Meze' },
        icon: Soup,
        sections: [
            {
                id: 'appetizers',
                title: { en: 'Appetizers', mk: 'Апетивајзери' },
                icon: Soup,
                items: [
                    {
                        id: 's1',
                        name: { en: 'Bruschetta', mk: 'Брускети' },
                        price: 9.00,
                        desc: { en: 'Toasted sourdough, heirloom tomatoes, basil, balsamic glaze.', mk: 'Тост лепче, домати, босилек, балсамико.' },
                        image: 'https://images.unsplash.com/photo-1572695157369-0e13840e6c86?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 's2',
                        name: { en: 'Calamari', mk: 'Лигњи' },
                        price: 14.00,
                        desc: { en: 'Crispy fried squash rings, lemon garlic aioli.', mk: 'Крцкави пржени прстени, аиоли сос.' },
                        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'soup',
                title: { en: 'Soups', mk: 'Супи' },
                icon: Soup,
                items: [
                    {
                        id: 's3',
                        name: { en: 'Tomato Basil', mk: 'Домат Босилек' },
                        price: 8.00,
                        desc: { en: 'Slow roasted tomatoes, fresh cream, basil oil.', mk: 'Печени домати, свеж крем, масло од босилек.' },
                        image: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&q=80&w=200'
                    }
                ]
            }
        ]
    },
    {
        id: 'salads',
        label: { en: 'Salads', mk: 'Салати', sq: 'Sallata' },
        icon: Salad,
        sections: [
            {
                id: 'greens',
                title: { en: 'Salads', mk: 'Салати' },
                icon: Salad,
                items: [
                    {
                        id: 'sl1',
                        name: { en: 'Caesar Salad', mk: 'Цезар Салата' },
                        price: 12.00,
                        desc: { en: 'Romaine hearts, parmesan crisp, house dressing.', mk: 'Ромaине, пармезан, домашен прелив.' },
                        image: 'https://images.unsplash.com/photo-1550304999-8fba44cc6e92?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'sl2',
                        name: { en: 'Greek Salad', mk: 'Грчка Салата' },
                        price: 13.00,
                        desc: { en: 'Cucumber, tomato, kalamata olives, feta cheese.', mk: 'Краставица, домат, маслинки, фета сирење.' },
                        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    },
    {
        id: 'pizza',
        label: { en: 'Pizza', mk: 'Пица', sq: 'Pica' },
        icon: Pizza,
        sections: [
            {
                id: 'red',
                title: { en: 'Red Base', mk: 'Црвена База' },
                icon: Pizza,
                items: [
                    {
                        id: 'p1',
                        name: { en: 'Margherita', mk: 'Маргарита' },
                        price: 16.00,
                        desc: { en: 'San Marzano tomato, buffalo mozzarella, basil.', mk: 'Сан Марцано домат, моцарела, босилек.' },
                        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'p2',
                        name: { en: 'Pepperoni', mk: 'Пеперони' },
                        price: 18.00,
                        desc: { en: 'Spicy salami, chili honey, mozzarella.', mk: 'Зачинета салама, чили мед, моцарела.' },
                        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'white',
                title: { en: 'White Base', mk: 'Бела База' },
                icon: Pizza,
                items: [
                    {
                        id: 'p3',
                        name: { en: 'Truffle Funghi', mk: 'Тартуфи Фунги' },
                        price: 20.00,
                        desc: { en: 'Wild mushrooms, truffle cream, thyme.', mk: 'Диви печурки, крем од тартуфи, мајчина душица.' },
                        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    },
    {
        id: 'pasta',
        label: { en: 'Pasta', mk: 'Паста', sq: 'Makarona' },
        icon: Utensils,
        sections: [
            {
                id: 'fresh-pasta',
                title: { en: 'Fresh Pasta', mk: 'Свежа Паста' },
                icon: Utensils,
                items: [
                    {
                        id: 'ps1',
                        name: { en: 'Carbonara', mk: 'Карбонара' },
                        price: 18.00,
                        desc: { en: 'Guanciale, pecorino, egg yolk, black pepper.', mk: 'Гванчијале, пекорино, жолчка, црн пипер.' },
                        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'ps2',
                        name: { en: 'Pesto Genovese', mk: 'Песто Џеновезе' },
                        price: 17.00,
                        desc: { en: 'Basil pesto, pine nuts, parmesan, green beans.', mk: 'Песто од босилек, борови ореви, пармезан.' },
                        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    },
    {
        id: 'food',
        label: { en: 'Bakery', mk: 'Пекара', sq: 'Furrë buke' },
        icon: Croissant,
        sections: [
            {
                id: 'bakery',
                title: { en: 'Pastries', mk: 'Печива' },
                icon: Croissant,
                items: [
                    {
                        id: 'f1',
                        name: { en: 'Almond Croissant', mk: 'Кроасан Бадем' },
                        price: 6.00,
                        desc: { en: 'Flaky pastry filled with almond cream.', mk: 'Лиснато тесто со крем од бадем.' },
                        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'f2',
                        name: { en: 'Cinnamon Bun', mk: 'Ролничка Цимет' },
                        price: 5.00,
                        desc: { en: 'Warm, gooey, and covered in frosting.', mk: 'Топло, лепливо, прелиено со глазура.' },
                        image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            },
            {
                id: 'breakfast',
                title: { en: 'Breakfast', mk: 'Појадок' },
                icon: Sunrise,
                items: [
                    {
                        id: 'f3',
                        name: { en: 'Avocado Toast', mk: 'Тост Авокадо' },
                        price: 12.00,
                        desc: { en: 'Sourdough, chili flakes, sea salt, lemon.', mk: 'Леб со квасец, чили, морска сол, лимон.' },
                        image: 'https://images.unsplash.com/photo-1588137372308-15f75323a399?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'f4',
                        name: { en: 'Granola Bowl', mk: 'Гранола' },
                        price: 10.00,
                        desc: { en: 'House-made granola, greek yogurt, berries.', mk: 'Домашна гранола, грчки јогурт, бобинки.' },
                        image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2f52?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    },
    {
        id: 'dessert',
        label: { en: 'Dessert', mk: 'Десерт', sq: 'Ëmbëlsira' },
        icon: IceCream,
        sections: [
            {
                id: 'sweets',
                title: { en: 'Sweets', mk: 'Слатко' },
                icon: IceCream,
                items: [
                    {
                        id: 'ds1',
                        name: { en: 'Tiramisu', mk: 'Тирамису' },
                        price: 9.00,
                        desc: { en: 'Espresso soaked ladyfingers, mascarpone.', mk: 'Пишкоти во еспресо, маскарпоне.' },
                        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=200'
                    },
                    {
                        id: 'ds2',
                        name: { en: 'Cheesecake', mk: 'Чизкејк' },
                        price: 9.00,
                        desc: { en: 'Burnt basque style cheesecake.', mk: 'Баскиски чизкејк.' },
                        image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&q=80&w=200'
                    },
                ]
            }
        ]
    }
];
