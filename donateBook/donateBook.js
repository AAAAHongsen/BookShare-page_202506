// 彈窗開關
const formModal = document.getElementById('formModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const card1 = document.querySelector('.card01');
const card2 = document.querySelector('.card02');
const card3 = document.querySelector('.card03');

if(card1 && formModal) {
  card1.addEventListener('click', () => {
    formModal.style.display = 'flex';
  });
}
if(closeModalBtn && formModal) {
  closeModalBtn.addEventListener('click', () => {
    formModal.style.display = 'none';
  });
}
// 點擊背景關閉
if(formModal) {
  formModal.addEventListener('click', (e) => {
    if (e.target === formModal) formModal.style.display = 'none';
  });
}
// 滾動到 Packing
if(card2) {
  card2.addEventListener('click', () => {
    document.querySelector('.container03').scrollIntoView({ behavior: 'smooth' });
  });
}
// 滾動到 Sending
if(card3) {
  card3.addEventListener('click', () => {
    document.querySelector('.container04').scrollIntoView({ behavior: 'smooth' });
  });
}

const form = document.querySelector('#formModal form');
if(form) {
  form.addEventListener('submit', function(e) {
    console.log('submit event triggered');
    const agreeRuleCheckbox = document.getElementById('agreeRule');
    if(!agreeRuleCheckbox || !agreeRuleCheckbox.checked) {
      alert('請先閱讀條件');
      e.preventDefault();
      return;
    }
    alert('感謝您的提交！收到書後我們會再用電子郵件通知您！謝謝您的幫助！');
    formModal.style.display = 'none';
    form.reset();
  });
}

// 條件 modal 開關
const requirementModal = document.getElementById('requirementModal');
const closeRequirementModalBtn = document.getElementById('closeRequirementModalBtn');
const showRequirement = document.getElementById('showRequirement');
const submitBtn = document.querySelector('.form-submit-btn');

let requirementChecked = false;

const agreeRuleCheckbox = document.getElementById('agreeRule');
if(agreeRuleCheckbox) agreeRuleCheckbox.disabled = true;

if(showRequirement && requirementModal) {
  showRequirement.addEventListener('click', (e) => {
    e.preventDefault();
    requirementModal.style.display = 'flex';
    requirementChecked = true;
    if(submitBtn) submitBtn.disabled = false;
    if(agreeRuleCheckbox) agreeRuleCheckbox.disabled = false;
  });
}
if(closeRequirementModalBtn && requirementModal) {
  closeRequirementModalBtn.addEventListener('click', () => {
    requirementModal.style.display = 'none';
  });
}
if(requirementModal) {
  requirementModal.addEventListener('click', (e) => {
    if (e.target === requirementModal) requirementModal.style.display = 'none';
  });
}
// 預設提交鍵 disabled
if(submitBtn) submitBtn.disabled = true;

if(agreeRuleCheckbox) {
  agreeRuleCheckbox.addEventListener('click', function(e) {
    if(!requirementChecked) {
      e.preventDefault();
      alert('請先閱讀條件');
    }
  });
}

// Cards 動畫
const cards = document.querySelectorAll('.Cards .card01, .Cards .card02, .Cards .card03');
const cardsContainer = document.querySelector('.Cards');
if(cardsContainer) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        cards.forEach(card => card.classList.add('show'));
      } else {
        cards.forEach(card => card.classList.remove('show'));
      }
    });
  }, { threshold: 0.3 });
  observer.observe(cardsContainer);
}

// Packing 動畫
const packingTitle = document.querySelector('.PackingTitle');
const packingNotice = document.querySelector('.PackingNotice');
const packingContainer = document.querySelector('.container03');
if(packingContainer && packingTitle && packingNotice) {
  const packingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        packingTitle.classList.add('show');
        packingTitle.classList.remove('hide');
        packingNotice.classList.add('show');
        packingNotice.classList.remove('hide');
      } else {
        packingTitle.classList.remove('show');
        packingTitle.classList.add('hide');
        packingNotice.classList.remove('show');
        packingNotice.classList.add('hide');
      }
    });
  }, { threshold: 0.3 });
  packingObserver.observe(packingContainer);
}

// Sending 動畫
const sendingTitle = document.querySelector('.SendingTitle');
const sendingNotice = document.querySelector('.SendingNotice');
const sendingContainer = document.querySelector('.container04');
if(sendingContainer && sendingTitle && sendingNotice) {
  const sendingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        sendingTitle.classList.add('show');
        sendingTitle.classList.remove('hide');
        sendingNotice.classList.add('show');
        sendingNotice.classList.remove('hide');
      } else {
        sendingTitle.classList.remove('show');
        sendingTitle.classList.add('hide');
        sendingNotice.classList.remove('show');
        sendingNotice.classList.add('hide');
      }
    });
  }, { threshold: 0.3 });
  sendingObserver.observe(sendingContainer);
}
