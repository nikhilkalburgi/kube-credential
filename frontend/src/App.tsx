import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import IssueCredential from './pages/IssueCredential';
import VerifyCredential from './pages/VerifyCredential';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-primary-600 text-white shadow-md">
          <div className="container mx-auto px-4">
            <ul className="flex space-x-8 justify-center py-4">
              <li>
                <Link 
                  to="/issue" 
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  Issue Credential
                </Link>
              </li>
              <li>
                <Link 
                  to="/verify"
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  Verify Credential
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<IssueCredential />} />
          <Route path="/issue" element={<IssueCredential />} />
          <Route path="/verify" element={<VerifyCredential />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;