import AdminCreateCityForm from '@/components/AdminCreateCityForm';

export const metadata = {
  title: 'Create New City Page | Stressfree Traveller'
};

export default function NewCityPageAdminPage() {
  return (
    <main className="container section">
      <AdminCreateCityForm />
    </main>
  );
}
