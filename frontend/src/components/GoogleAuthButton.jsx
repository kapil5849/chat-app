// import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
// import { app } from '../../firebase';
// import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

const GoogleAuthButton = () => {
    // const { login } = useAuthStore(); 

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await response.json();

            if (data.success) {
                login({
                    email: data.user.email,
                });
                toast.success("Logged in with Google successfully");
            } else {
                throw new Error(data.message || "Google authentication failed");
            }

        } catch (error) {
            console.error('Could not sign in with Google', error);
            toast.error(error.message || "Google sign-in failed");
        }
    };

    return (
        <div>
            <button 
                className="btn btn-primary w-full" 
                // onClick={handleGoogleClick} 
                type='button'
            >
                Continue with Google
            </button>
        </div>
    );
};

export default GoogleAuthButton;

