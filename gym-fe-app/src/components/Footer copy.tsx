export const Footer = () => {
  const links = [
    {
      id: 1,
      title: "Links",
      column: "col-lg-2 col-md-3 col-sm-6 mb-30",
      items: [
        { label: "Home", href: "/" },
        { label: "Cos'è FitNexus", href: "/aboutFitNexus" },
        { label: "In nostri coach", href: "/coach" },
        { label: "I nutrizionisti", href: "nutrizionisti" },
        { label: "Servizi", href: "#services" },
      ],
    },
    {
      id: 2,
      title: "Services",
      column: "col-lg-3 col-md-4 col-sm-6 mb-30",
      items: [
        { label: "Schede personalizzate", href: "/service-details" },
        { label: "Coaching online", href: "/service-details" },
        { label: "Schede tutorial", href: "/service-details" },
        { label: "Come usare la web app", href: "/service-details" },
       
      ],
    },
  ];

  const socialIcons = [
    {
      iconClass: "fab fa-facebook-f",
      link: "#",
    },
    {
      iconClass: "fab fa-instagram",
      link: "https://www.instagram.com/fitnexus/#",
    },
   
  ];

  return (
    <>
      {links.map((link) => (
        <div className={link.column} key={link.id}>
          <h5 className="footer-title text-white fw-500">{link.title}</h5>
          <ul className="footer-nav-link style-none">
            {link.items.map((item, i) => (
              <li key={i}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="col-xl-3 col-lg-4 col-md-5 mb-30">
        <h5 className="footer-title text-white fw-500">Dove siamo</h5>
        <p className="text-white opacity-75 mb-35">
         Roma <br />
     via via via
        </p>
        <ul className="d-flex social-icon style-none">
          {socialIcons.map((icon, index) => (
            <li key={index}>
              <a href={icon.link} target="_blank" rel="noopener noreferrer">
                <i className={icon.iconClass} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
