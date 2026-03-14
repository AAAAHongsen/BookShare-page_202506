document.addEventListener('DOMContentLoaded', () => {
    // 添加所有動畫樣式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-card {
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(-100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 過濾按鈕功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按鈕的 active 類
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 為當前點擊的按鈕添加 active 類
            button.classList.add('active');

            // 獲取選中的類別
            const category = button.textContent.trim();

            // 過濾商品卡片
            productCards.forEach(card => {
                if (category === '全部書籍') {
                    card.style.display = 'block';
                    // 添加淡入動畫
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    if (card.dataset.category === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // 兌換按鈕動畫效果
    const exchangeButtons = document.querySelectorAll('.exchange-btn');
    exchangeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 添加點擊動畫
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);

            // 修正點數解析邏輯
            const pointsRequiredText = button.parentElement.querySelector('.points-required').textContent;
            const pointsRequired = parseInt(pointsRequiredText.replace(/[^0-9]/g, '')); // 只保留數字

            const currentPointsText = document.querySelector('.points-number').textContent;
            const currentPoints = parseInt(currentPointsText.replace(/[^0-9]/g, '')); // 只保留數字

            console.log('Current points:', currentPoints); // 調試用
            console.log('Points required:', pointsRequired); // 調試用

            if (currentPoints >= pointsRequired) {
                // 顯示兌換確認對話框
                if (confirm('確定要兌換此商品嗎？')) {
                    // 更新點數
                    const newPoints = currentPoints - pointsRequired;
                    document.querySelector('.points-number').textContent = newPoints.toLocaleString(); // 添加千分位分隔符

                    // 顯示成功訊息
                    showNotification('兌換成功！', 'success');
                }
            } else {
                showNotification(`點數不足！需要 ${pointsRequired} 點，您目前有 ${currentPoints} 點`, 'error');
            }
        });
    });

    // 通知功能
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // 修改樣式，將通知放在導航欄下方
        notification.style.position = 'fixed';
        notification.style.top = '9vh'; // 與導航欄高度相同
        notification.style.right = '20px';
        notification.style.padding = '1rem 2rem';
        notification.style.borderRadius = '0 0 5px 5px'; // 只保留底部圓角
        notification.style.color = 'white';
        notification.style.backgroundColor = type === 'success' ? 'rgb(63, 169, 109)' : '#e74c3c';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '999'; // 確保在導航欄下方
        notification.style.animation = 'slideIn 0.5s ease-out';

        document.body.appendChild(notification);

        // 3秒後移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}); 