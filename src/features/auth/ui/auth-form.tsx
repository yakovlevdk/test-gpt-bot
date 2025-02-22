import { useState } from 'react';
import styles from './auth-form.module.css';
import { useAuthActions } from '../lib/onSubmitAuthForm';
export const AuthForm = () => { 
    const { onSubmitAuthForm } = useAuthActions();
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault()
    onSubmitAuthForm({email, password})
}

    return ( 
        <div className={styles['auth-form']}>
            <div className={styles['auth-form-title-div']}>
                <span className={styles['auth-form-title']}>Авторизация</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#616D8D" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="#616D8D" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="email-input">E-Mail</label>
                <input placeholder='Ваш E-Mail' name='email-input' type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="password-input">Пароль</label>
                <input placeholder='Ваш пароль' name='password-input' type='password'  value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit' className={styles['auth-button']}>Войти</button>
            </form>
        </div>
    )
}

