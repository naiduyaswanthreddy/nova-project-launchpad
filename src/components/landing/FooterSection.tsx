import { Rocket, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FooterSection = () => {
  return (
    <footer className="border-t border-white/10 py-12 mt-auto">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold gradient-text mb-4">CrowdHive</h3>
            <p className="text-gray-400 mb-4">
              Decentralized crowdfunding powered by the Hive blockchain.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h4"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M16 16h6m-3-3v6"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/projects" className="text-gray-400 hover:text-white">Explore Projects</a></li>
              <li><a href="/my-projects" className="text-gray-400 hover:text-white">My Projects</a></li>
              <li><a href="#join" className="text-gray-400 hover:text-white">Start a Project</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="https://hive.io/whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Hive Whitepaper</a></li>
              <li><a href="https://hive.blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Hive Blog</a></li>
              <li><a href="https://wallet.hive.blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Hive Wallet</a></li>
              <li><a href="https://hive-keychain.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Hive Keychain</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Get Started</h4>
            <p className="text-gray-400 mb-4">
              Have a project idea? Launch it on CrowdHive and secure funding through the Hive blockchain.
            </p>
            <a href="#join">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Rocket className="mr-2 h-4 w-4" />
                Launch Project
              </Button>
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2025 CodeBlue. All Rights Reserved. Powered by HIVE Blockchain.</p>
        </div>
      </div>
    </footer>
  );
};
