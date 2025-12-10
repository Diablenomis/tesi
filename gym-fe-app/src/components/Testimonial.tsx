import Slider from "react-slick";
import testimonial from "../data/testimonial";

const Testimonial = () => {
  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...settings}>
        {testimonial.map((item: any) => (
          <div className="item row justify-center" key={item.id}>
            <img src={item.image} alt={`Trasformazione ${item.id}`} height={550} width={"auto"} />
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Testimonial;
