// app.jsx — Frame Club main app shell + router

function FCApp() {
  const [route, setRoute] = React.useState("home");
  const [currentProduct, setCurrentProduct] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [order, setOrder] = React.useState(null);
  const ref = React.useRef(null);

  // Init cursor + progress bar once
  React.useEffect(() => {
    FCMotion.bindCursor();
    FCMotion.bindProgress();
  }, []);

  // Per-route: refresh ScrollTrigger, bind magnetic + tilt + scroll-driven effects
  React.useEffect(() => {
    const t = setTimeout(() => {
      FCMotion.bindMagnetic(document);
      FCMotion.bindCardTilt(document);
      FCMotion.refresh();
    }, 200);
    return () => clearTimeout(t);
  }, [route, currentProduct]);

  // ---- Page transition wrapper ------------------------------------------
  function navigate(next) {
    if (next === route) return;
    FCMotion.pageTransition(() => {
      setRoute(next);
      window.scrollTo(0, 0);
    });
  }
  function viewProduct(p) {
    FCMotion.pageTransition(() => {
      setCurrentProduct(p);
      setRoute("product");
      window.scrollTo(0, 0);
    });
  }
  function addToCart(p) {
    const item = { ...p, qty: p.qty || 1 };
    setCart((c) => {
      // merge by id + options
      const idx = c.findIndex((x) => x.id === item.id && JSON.stringify(x.options) === JSON.stringify(item.options));
      if (idx >= 0) {
        const next = [...c];
        next[idx] = { ...next[idx], qty: (next[idx].qty || 1) + item.qty };
        return next;
      }
      return [...c, item];
    });
  }
  function placeOrder(o) {
    const final = { ...o, id: Math.floor(10000 + Math.random() * 89999) };
    setOrder(final);
    setCart([]);
  }

  let content = null;
  switch (route) {
    case "shop":      content = <FCShopScreen navigate={navigate} viewProduct={viewProduct} addToCart={addToCart} />; break;
    case "product":   content = <FCProductScreen product={currentProduct} navigate={navigate} addToCart={addToCart} />; break;
    case "cart":      content = <FCCartScreen cart={cart} setCart={setCart} navigate={navigate} />; break;
    case "checkout":  content = <FCCheckoutScreen cart={cart} navigate={navigate} onPlaceOrder={placeOrder} />; break;
    case "confirm":   content = <FCConfirmScreen order={order} navigate={navigate} />; break;
    case "story":     content = <FCStoryScreen navigate={navigate} />; break;
    case "contact":   content = <FCContactScreen navigate={navigate} />; break;
    default:          content = <FCHomeScreen navigate={navigate} viewProduct={viewProduct} addToCart={addToCart} />;
  }

  return (
    <>
      <FCChromeMount />
      <FCSiteHeader route={route} navigate={navigate} cartCount={cart.reduce((s, i) => s + (i.qty || 1), 0)} />
      <main ref={ref}>{content}</main>
      <FCSiteFooter navigate={navigate} />
    </>
  );
}

window.FCApp = FCApp;

const root = ReactDOM.createRoot(document.getElementById("fc-root"));
root.render(<FCApp />);
