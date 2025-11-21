import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Students } from './pages/Students';
import { StudentForm } from './pages/StudentForm';
import { StudentDetail } from './pages/StudentDetail';
import { Schedule } from './pages/Schedule';
import { ClassForm } from './pages/ClassForm';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule/new" element={<ClassForm />} />
          <Route path="/schedule/edit/:id" element={<ClassForm />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id" element={<StudentDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
