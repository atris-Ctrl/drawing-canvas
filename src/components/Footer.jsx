function Footer() {
  return (
    <footer className="w-full bg-[#1898dd] text-white py-6 ">
      <div className=" max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="bg-[#1b8718]">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Drawing Canvas. All rights
            reserved.
          </p>
        </div>
        ₊✩‧₊˚౨ৎ˚₊✩‧₊
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a href="#" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="text-sm hover:underline">
            Terms of Service
          </a>
          <a href="#" className="text-sm hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
