import RegistrationForm from '@/components/registration/RegistrationForm';
import { useSearchParams } from 'react-router-dom';

export default function Registration() {
  const [searchParams] = useSearchParams();
  const isSimplified = searchParams.get('flow') === 'simple';

  return <RegistrationForm isSimplified={isSimplified} />;
}
