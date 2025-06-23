import "./style.scss";

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Điều Khoản Sử Dụng</h1>
        <p>Cập nhật lần cuối: 23/06/2025</p>
      </div>
      <div className="terms-content">
        <section>
          <h2>1. Giới thiệu</h2>
          <p>
            Chào mừng bạn đến với <strong>Capstone Social</strong> – nền tảng mạng xã hội kết nối, chia sẻ và khám phá được phát triển tại Việt Nam. Bằng việc sử dụng nền tảng, bạn đồng ý với tất cả các điều khoản dưới đây.
          </p>
        </section>

        <section>
          <h2>2. Điều kiện sử dụng</h2>
          <ul>
            <li>Bạn phải từ 13 tuổi trở lên để sử dụng Capstone Social.</li>
            <li>Phải cung cấp thông tin chính xác và đầy đủ khi đăng ký.</li>
            <li>Chịu trách nhiệm về hoạt động và bảo mật tài khoản của bạn.</li>
          </ul>
        </section>

        <section>
          <h2>3. Nội dung người dùng</h2>
          <p>
            Người dùng giữ quyền sở hữu nội dung đăng tải nhưng cấp quyền cho Capstone Social được lưu trữ và hiển thị phục vụ vận hành nền tảng.
          </p>
          <p>
            Nghiêm cấm chia sẻ nội dung vi phạm pháp luật, đồi trụy, bạo lực, sai sự thật hoặc trái với thuần phong mỹ tục Việt Nam.
          </p>
        </section>

        <section>
          <h2>4. Hành vi bị cấm</h2>
          <ul>
            <li>Mạo danh người khác.</li>
            <li>Quấy rối, bắt nạt hoặc đe dọa người khác.</li>
            <li>Tải lên mã độc, virus.</li>
            <li>Thu thập dữ liệu trái phép.</li>
            <li>Quảng cáo không được cho phép.</li>
          </ul>
        </section>

        <section>
          <h2>5. Quyền và trách nhiệm của Capstone Social</h2>
          <p>
            Capstone Social có quyền xóa nội dung, khóa tài khoản vi phạm, cập nhật dịch vụ mà không cần thông báo trước trong một số trường hợp.
          </p>
        </section>

        <section>
          <h2>6. Quyền riêng tư</h2>
          <p>
            Thông tin cá nhân của bạn được bảo vệ theo Chính sách Bảo mật. Bạn có thể quản lý quyền riêng tư trong phần cài đặt tài khoản.
          </p>
        </section>

        <section>
          <h2>7. Chấm dứt sử dụng</h2>
          <p>
            Người dùng có thể ngưng sử dụng bất cứ lúc nào. Chúng tôi có quyền chấm dứt tài khoản nếu có vi phạm nghiêm trọng.
          </p>
        </section>

        <section>
          <h2>8. Luật áp dụng</h2>
          <p>
            Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp sẽ được xử lý tại tòa án có thẩm quyền tại Việt Nam.
          </p>
        </section>

        <section>
          <h2>9. Liên hệ</h2>
          <p>
            Mọi thắc mắc xin gửi về: <a href="mailto:support@capstonesocial.vn">support@capstonesocial.vn</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
