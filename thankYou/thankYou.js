document.addEventListener('DOMContentLoaded', () => {
  const leafContainer = document.getElementById("leaf-container");
  const leafImages = {
    money: ["../img/leaf-1-yellow.png", "../img/leaf-2-yellow.png", "../img/leaf-3-yellow.png"],
    book: ["../img/leaf-1-green.png", "../img/leaf-2-green.png", "../img/leaf-3-green.png"]
  };

  const donors = [
    { name: "Tinge嘎", type: "money", amount: 5000, message: "願每一元，都開出希望的花朵。" },
    { name: "葳葳", type: "book", amount: 5, message: "希望你們喜歡這些書！" },
    { name: "阿黃", type: "book", amount: 10, message: "這些故事陪我長大，也想陪你走一段路。" },
    { name: "阿紅", type: "money", amount: 1000, message: "書中自有黃金屋！" },
    { name: "YeahYeah", type: "money", amount: 1000, message: "一點小小的幫助" },
    { name: "忻育", type: "book", amount: 8, message: "把書送給你，就像把夢想交到你手上！" },
    { name: "黃老師", type: "money", amount: 3000, message: "希望孩子們能多讀書！" },
    { name: "方老師", type: "book", amount: 12, message: "安心學習、快樂成長" },
    { name: "性感母蟑螂", type: "money", amount: 500, message: "加油！" },
    { name: "張老師", type: "money", amount: 1000, message: "感謝你們的努力！" },
    { name: "學弟", type: "book", amount: 10, message: "分享讓我們都更富有。" },
    { name: "學妹", type: "book", amount: 5, message: "每一本書，都是我的祝福。" },
    { name: "佳佳", type: "book", amount: 12, message: "這些書陪我長大，也想陪別人成長。" },
    { name: "阿中", type: "money", amount: 50, message: "一點點心意，希望有幫助。" },
    { name: "林小姐", type: "money", amount: 300, message: "一點心意" },
    { name: "張阿榮", type: "book", amount: 10, message: "希望孩子們喜歡這些書！" },
    { name: "方先生", type: "book", amount: 20, message: "一起讓閱讀更普及" },
    { name: "王小明", type: "money", amount: 1000, message: "支持閱讀！" },
    { name: "葉小美", type: "book", amount: 5, message: "分享知識！" },
    { name: "陳書書", type: "book", amount: 8, message: "知識就是力量。" }
  ];

  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  let totalMoney = 0, totalBooks = 0;
  const leaves = [];

  function createLeaf(donor) {
    const isMoney = donor.type === "money";
    const amount = parseInt(donor.amount);

    if (isMoney) {
      totalMoney += amount;
      document.getElementById("total-money").textContent = totalMoney.toLocaleString();
    } else {
      totalBooks += amount;
      document.getElementById("total-books").textContent = totalBooks.toLocaleString();
    }

    const leaf = document.createElement("img");
    leaf.className = `leaf ${isMoney ? "yellow" : "green"}`;
    leaf.src = leafImages[donor.type][Math.floor(Math.random() * 3)];
    leaf.draggable = false;

    const top = Math.random() * 180 + 20;
    const left = Math.random() * 90;
    const rotate = Math.random() * 360;

    Object.assign(leaf.style, {
      top: `${top}vh`,
      left: `${left}%`,
      position: "absolute",
      transition: "transform 0.2s ease-out",
      transform: `rotate(${rotate}deg)`
    });

    leaf.dataset.baseRotate = rotate;
    leafContainer.appendChild(leaf);
    leaves.push(leaf);

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.style.display = "none";
    tooltip.innerHTML = `
      <strong>${donor.name}</strong><br>
      ${isMoney ? `捐款: ${amount} 元` : `捐書: ${amount} 本`}<br>
      <em>${donor.message}</em>
    `;
    leafContainer.appendChild(tooltip);

    leaf.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
      tooltip.style.left = `${leaf.offsetLeft + 80}px`;
      tooltip.style.top = `${leaf.offsetTop}px`;
      tooltip.style.border = "2px solid rgb(146, 119, 91)";
      tooltip.style.backgroundColor = "var(--skin-color)";
    });
    leaf.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  }
  donors.forEach(createLeaf);

  window.addEventListener("mousemove", (e) => {
    const dx = (e.clientX - window.innerWidth / 2) / 50;
    const dy = (e.clientY - window.innerHeight / 2) / 30;
    leaves.forEach(leaf => {
      const base = parseFloat(leaf.dataset.baseRotate) || 0;
      leaf.style.transform = `rotate(${base + dx}deg) translateY(${dy}px)`;
    });
  });

  document.querySelectorAll('.pdf-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = link.textContent.trim();
      alert(`已下載 ${text}`);
    });
  });
});