import React, { useState} from 'react';
import './Huntercalc.css';

export default function Huntercalc() {
    const basePrices = {
        Олень: 500,
        Кролик: 400,
        Пума: 900,
        Волк: 700,
        Медведь: 1000
    };

    const [selectedSkin, setSelectedSkin] = useState('Олень');
    const [quantity, setQuantity] = useState(1);
    const [buyPrice, setBuyPrice] = useState('');
    const [inventory, setInventory] = useState([]);
    const [sellMoney, setSellMoney] = useState(0);
    const [buyMoney, setBuyMoney] = useState(0);
    const [margin, setMargin] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showDollars, setShowDollars] = useState(false);

    const calculateSellPrice = (level, basePrice) =>
        Math.round(basePrice + (basePrice * 0.05) * level + basePrice * 0.25);

    const formatNumber = (value) =>
        value.toLocaleString('ru-RU', { useGrouping: true }).replace(/,/g, ' ');

    const addToInventory = () => {
        const numQuantity = parseInt(quantity);
        const numBuyPrice = parseFloat(buyPrice);

        if (!selectedSkin || isNaN(numQuantity) || isNaN(numBuyPrice)) {
            alert('Заполните все поля!');
            return;
        }

        const newItem = {
            id: Date.now(),
            skin: selectedSkin,
            quantity: numQuantity,
            buyPrice: numBuyPrice,
            sellPrice25: calculateSellPrice(25, basePrices[selectedSkin]),
        };

        setInventory([...inventory, newItem]);
    };

    const removeFromInventory = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const clearInventory = () => {
        setInventory([]);
        setShowResult(false);
        setShowPopup(false);
    };

    const createDollar = () => {
        const dollar = document.createElement('div');
        dollar.className = 'dollar';
        dollar.textContent = '$';
        dollar.style.left = `${Math.random() * 100}%`;
        document.querySelector('.dollar-container').appendChild(dollar);
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            dollar.remove();
        }, 3000);
    };

    const calculateProfit = () => {
        let totalSell = 0;
        let totalBuy = 0;

        inventory.forEach(item => {
            const sell = Math.round(item.sellPrice25 * item.quantity);
            const buy = Math.round(item.buyPrice * item.quantity);
            totalSell += sell;
            totalBuy += buy;
        });

        const profit = totalSell - totalBuy;

        setSellMoney(totalSell);
        setBuyMoney(totalBuy);
        setMargin(profit);
        setShowResult(true);

        // Запускаем анимацию долларов только если сумма продаж больше 300,000
        if (totalSell > 300000) {
            setShowDollars(true);
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createDollar();
                }, i * 150);
            }
            setTimeout(() => {
                setShowDollars(false);
            }, 3000);
        }

        if (profit > 100000) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 6000);
        }
    };

    return (
        <div className="huntercalc">
            {showDollars && <div className="dollar-container" />}
            <h1>HunterCalc v0.03 для ProximaRP</h1>

            {/* Форма добавления */}
            <div className="form-block">
                <div className="form-group">
                    <label>Выберите шкуру:</label>
                    <select
                        value={selectedSkin}
                        onChange={(e) => setSelectedSkin(e.target.value)}
                    >
                        <option value="Олень">Олень</option>
                        <option value="Кролик">Кролик</option>
                        <option value="Волк">Волк</option>
                        <option value="Пума">Пума</option>
                        <option value="Медведь">Медведь</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Количество:</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Цена покупки ($):</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                    />
                </div>

                <button onClick={addToInventory}>Добавить в инвентарь</button>
            </div>

            {/* Инвентарь */}
            <div className="inventory-section">
                <div className="inventory-actions">
                    <button className="clear-button" onClick={clearInventory}>Очистить</button>
                    <button className="calculate-button" onClick={calculateProfit}>Рассчитать прибыль</button>
                </div>

                {inventory.length === 0 ? (
                    <p className="empty-message">Инвентарь пуст</p>
                ) : (
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Шкура</th>
                                <th>Кол-во</th>
                                <th>Покупка ($)</th>
                                <th>Продажа ($)</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="Шкура">{item.skin}</td>
                                    <td data-label="Кол-во">{item.quantity}</td>
                                    <td data-label="Покупка ($)">{formatNumber(item.buyPrice)}</td>
                                    <td data-label="Продажа ($)">{formatNumber(item.sellPrice25)}</td>
                                    <td data-label="Действия">
                                        <button onClick={() => removeFromInventory(item.id)}>Удалить</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Результаты */}
            {showResult && (
                <div className="result-block">
                    {showPopup && (
                        <div className="popup-image">
                            <img src="https://sun9-80.userapi.com/impg/xY38eFtYFkACRRWDQVmYyg5iSdG72VaFS4Ridg/7I3WE9zaKA8.jpg?size=512x512&quality=95&sign=78c015471b1680989a98ceb50350f810&type=album" alt="Вы богаты!" />
                        </div>
                    )}
                    <h2>Результаты расчёта</h2>
                    <p>Общая сумма продаж: <span>{formatNumber(sellMoney)}$</span></p>
                    <p>Общая сумма покупок: <span>{formatNumber(buyMoney)}$</span></p>
                    <p>Чистая маржа: <span>{formatNumber(margin)}$</span></p>
                </div>
            )}
        </div>
    );
}