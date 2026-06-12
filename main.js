// main.js

// Bật thông báo lỗi toàn cục ra màn hình để debug dễ dàng hơn
window.onerror = function(message, source, lineno, colno, error) {
    alert("Lỗi JavaScript hệ thống: " + message + " (Dòng " + lineno + ":" + colno + ")");
    return false;
};

// === CONFIG SUPABASE ===
const SUPABASE_URL = 'https://gadunkmhysfgbdqmcbev.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bBZBHrbbgVJHsVJSbwvCcw_CvM7CiQO';

let supabase = null;

// Initialize Supabase safely
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase SDK is not loaded yet. Will try to load dynamically on form submission.");
    }
} catch (e) {
    console.error("Failed to initialize Supabase client:", e);
}

// === INTERACTIVE SERVICE CARDS CLICK TO BOOK ===
const serviceCards = document.querySelectorAll('.service-detail-card');
const selectService = document.getElementById('regService');
const bookingSection = document.getElementById('booking-section');

if (serviceCards && selectService && bookingSection) {
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const titleElement = card.querySelector('h4');
            if (!titleElement) return;
            
            const serviceTitle = titleElement.innerText.trim();
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
            
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            
            const formBox = document.querySelector('.booking-form-box');
            if (formBox) {
                formBox.style.borderColor = '#ffdf7a';
                formBox.style.boxShadow = '0 0 30px rgba(255, 223, 122, 0.4)';
                setTimeout(() => {
                    formBox.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                    formBox.style.boxShadow = '0 25px 60px rgba(0,0,0,0.5)';
                }, 1500);
            }
        });
    });
}

// === SUBMIT REGISTRATION FORM ===
const inlineForm = document.getElementById('inlineBookingForm');
const statusBox = document.getElementById('inlineFormStatus');

if (inlineForm && statusBox) {
    inlineForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn trang bị tải lại
        
        alert("Đã nhận lệnh gửi Form! Bắt đầu xử lý dữ liệu...");
        
        // Disable submit button
        const submitBtn = inlineForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerText : 'Gửi Yêu Cầu Đăng Ký';
        if (submitBtn) {
            submitBtn.innerText = 'ĐANG GỬI ĐĂNG KÝ...';
            submitBtn.disabled = true;
        }
        
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
            // Re-attempt to initialize Supabase client if it failed initially
            if (!supabase) {
                if (window.supabase) {
                    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                } else {
                    throw new Error('Không thể tải thư viện kết nối (Supabase SDK). Vui lòng kiểm tra lại mạng Internet.');
                }
            }

            alert("Đang kết nối tới Supabase để gửi thông tin:\n" + JSON.stringify(data));

            // Insert booking row into Supabase
            const { error } = await supabase
                .from('bookings')
                .insert([data]);

            if (error) {
                // If table is not created yet
                if (error.code === '42P01' || error.message.includes('relation "bookings" does not exist')) {
                    throw new Error('Lỗi CSDL: Bảng "bookings" chưa được tạo trên Supabase. Bạn hãy chạy câu lệnh SQL tạo bảng trong SQL Editor.');
                }
                throw error;
            }

            alert("Supabase phản hồi: THÀNH CÔNG!");

            // Success state
            statusBox.textContent = 'Gửi yêu cầu thành công! TC FIX sẽ liên hệ lại với bạn sớm qua SĐT/Zalo.';
            statusBox.className = 'form-status success';
            statusBox.classList.remove('hidden');
            inlineForm.reset();

        } catch (err) {
            alert("Lỗi khi gửi lên Supabase:\n" + err.message);
            console.error('Submission error details:', err);
            statusBox.textContent = err.message || 'Gửi yêu cầu thất bại. Vui lòng liên hệ Hotline trực tiếp.';
            statusBox.className = 'form-status error';
            statusBox.classList.remove('hidden');
        } finally {
            // Restore submit button
            if (submitBtn) {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
}
