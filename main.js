// === CONFIG SUPABASE ===
// Đã điền sẵn URL dựa trên ảnh chụp màn hình của bạn
const SUPABASE_URL = 'https://gadunkmhysfgbdqmcbev.supabase.co';
// Đã điền sẵn Publishable key của bạn
const SUPABASE_ANON_KEY = 'sb_publishable_bBZBHrbbgVJHsVJSbwvCcw_CvM7CiQO';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === INTERACTIVE SERVICE CARDS CLICK TO BOOK ===
const serviceCards = document.querySelectorAll('.service-detail-card');
const selectService = document.getElementById('regService');
const bookingSection = document.getElementById('booking-section');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const titleElement = card.querySelector('h4');
        if (!titleElement) return;
        
        const serviceTitle = titleElement.innerText.trim();
        
        // Match the service card title with dropdown options
        let matchedVal = "";
        
        if (serviceTitle.includes("Spa Giày")) {
            matchedVal = "Spa Giày Chuyên Sâu";
        } else if (serviceTitle.includes("Sửa Chữa Giày")) {
            matchedVal = "Sửa Chữa Giày";
        } else if (serviceTitle.includes("Phục Hồi Màu")) {
            matchedVal = "Phục Hồi Màu Sơn";
        } else if (serviceTitle.includes("Mũ Bảo Hiểm")) {
            matchedVal = "Spa Mũ Bảo Hiểm";
        } else if (serviceTitle.includes("Phun Nhám")) {
            matchedVal = "Phun Nhám Mặt Vợt";
        } else if (serviceTitle.includes("Bảo Dưỡng Trọn Gói")) {
            matchedVal = "Bảo Dưỡng Thay Grip";
        } else if (serviceTitle.includes("Cân Chỉnh")) {
            matchedVal = "Cân Chỉnh Swingweight";
        }
        
        if (matchedVal) {
            selectService.value = matchedVal;
        } else {
            selectService.value = "Dịch vụ khác";
        }
        
        // Smooth scroll to form section
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        
        // Flash glow on the form to grab attention
        const formBox = document.querySelector('.booking-form-box');
        formBox.style.borderColor = '#ffdf7a';
        formBox.style.boxShadow = '0 0 30px rgba(255, 223, 122, 0.4)';
        setTimeout(() => {
            formBox.style.borderColor = 'rgba(212, 175, 55, 0.25)';
            formBox.style.boxShadow = '0 25px 60px rgba(0,0,0,0.5)';
        }, 1500);
    });
});

// === SUBMIT REGISTRATION FORM ===
const inlineForm = document.getElementById('inlineBookingForm');
const statusBox = document.getElementById('inlineFormStatus');

inlineForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button
    const submitBtn = inlineForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'ĐANG GỬI ĐĂNG KÝ...';
    submitBtn.disabled = true;
    
    // Reset status
    statusBox.classList.add('hidden');
    statusBox.className = 'form-status';

    // Extract form data
    const formData = new FormData(inlineForm);
    const data = {
        full_name: formData.get('regName'),
        phone: formData.get('regPhone'),
        service_type: formData.get('regService'),
        notes: formData.get('regNotes')
    };

    try {
        // Safe check for default placeholders
        if (SUPABASE_URL.includes('your-project-id')) {
            throw new Error('Vui lòng điền Supabase URL & Anon Key thực tế trong file main.js để thực hiện gửi dữ liệu.');
        }

        // Insert booking row into Supabase
        const { error } = await supabase
            .from('bookings')
            .insert([data]);

        if (error) throw error;

        // Success state
        statusBox.textContent = 'Gửi yêu cầu thành công! TC FIX sẽ liên hệ lại với bạn sớm qua SĐT/Zalo.';
        statusBox.className = 'form-status success';
        statusBox.classList.remove('hidden');
        inlineForm.reset();

    } catch (err) {
        console.error('Submission error:', err);
        statusBox.textContent = err.message || 'Gửi yêu cầu thất bại. Vui lòng liên hệ Hotline trực tiếp.';
        statusBox.className = 'form-status error';
        statusBox.classList.remove('hidden');
    } finally {
        // Restore submit button
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});
