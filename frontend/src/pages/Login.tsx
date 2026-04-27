import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginOptions from "@/components/LoginOptions";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <LoginOptions />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
