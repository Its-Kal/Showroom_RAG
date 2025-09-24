interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  content: string;
  car: string;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="testimonial-card">
      <div className="avatar-placeholder"></div>
      <div className="testimonial-header">
        <h4>{testimonial.name}</h4>
        <p className="role">{testimonial.role}</p>
      </div>
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <blockquote className="content">
        "{testimonial.content}"
      </blockquote>
      <div className="car-info">
        <span>Membeli: {testimonial.car}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;