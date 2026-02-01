'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { System, Sensitivity, LoginData, GeneratedSettings, AndroidSettings, IosSettings } from '@/lib/types';
import { generateSettings } from '@/lib/sensitivity-generator';
import { useCooldown } from '@/hooks/use-cooldown';
import { AnimatedSlider } from '@/components/animated-slider';
import { Smartphone, Apple, Terminal, LogOut, CheckCircle } from 'lucide-react';

type AppStep = 'login' | 'loading' | 'sensitivity_select' | 'generating' | 'results';

const IPHONE_MODELS = [
    "iPhone 7", "iPhone 7 Plus",
    "iPhone 8", "iPhone 8 Plus",
    "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
    "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
    "iPhone SE (2nd generation)",
    "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
    "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
    "iPhone SE (3rd generation)",
    "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
    "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
];


const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes

const KizaruLogo = () => (
    <>
        <h1 className="text-5xl font-black text-center text-white text-glow mb-2">KIZARU</h1>
        <p className="text-center text-primary font-medium mb-8">PAINEL</p>
    </>
);

const LoadingScreen = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center text-center h-64">
        <Terminal className="text-primary h-12 w-12 animate-pulse mb-4" />
        <p className="text-white font-medium text-lg">{message}</p>
    </div>
);


export default function AppFlow() {
    const [step, setStep] = useState<AppStep>('login');
    const [loginData, setLoginData] = useState<LoginData | null>(null);
    const [system, setSystem] = useState<System | null>(null);
    const [sensitivity, setSensitivity] = useState<Sensitivity | null>(null);
    const [generatedSettings, setGeneratedSettings] = useState<GeneratedSettings | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [showPostGenerationNotice, setShowPostGenerationNotice] = useState(false);
    const { toast } = useToast();
    const { isCoolingDown, remainingTime, startCooldown } = useCooldown(COOLDOWN_DURATION);

    // If cooldown is active on load, jump to results/cooldown step
    useEffect(() => {
        if (isCoolingDown) {
            setStep('results');
        }
    }, [isCoolingDown]);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const password = formData.get('password');
        const systemValue = formData.get('system') as System;
        const deviceModel = systemValue === 'ios' ? formData.get('deviceModelSelect') as string : formData.get('deviceModelInput') as string;

        if (password !== '171') {
            toast({ title: "Erro de Acesso", description: "Senha incorreta.", variant: "destructive" });
            return;
        }

        if (!systemValue || !deviceModel) {
            toast({ title: "Erro de Acesso", description: "Por favor, preencha todos os campos.", variant: "destructive" });
            return;
        }

        setLoginData({ system: systemValue, deviceModel });
        setSystem(systemValue);
        setStep('loading');
        setTimeout(() => setStep('sensitivity_select'), 2500);
    };

    const handleSelectSensitivity = (selectedSensitivity: Sensitivity) => {
        setSensitivity(selectedSensitivity);
    };
    
    const handleLogout = () => {
        setStep('login');
        setLoginData(null);
        setSystem(null);
        setSensitivity(null);
        setGeneratedSettings(null);
        setIsLogoutModalOpen(false);
    };


    const handleGenerate = () => {
        if (!system || !sensitivity) {
            toast({ title: "Erro", description: "Selecione o sistema e a sensibilidade.", variant: "destructive" });
            return;
        }
        if (isCoolingDown) {
            toast({ title: "Aguarde", description: "Você deve esperar o tempo de recarga terminar." });
            return;
        }

        setStep('generating');
        setTimeout(() => {
            const settings = generateSettings(system, sensitivity);
            setGeneratedSettings(settings);
            startCooldown();
            setStep('results');
            setShowPostGenerationNotice(true);
        }, 2000);
    };
    
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const renderStep = () => {
        switch (step) {
            case 'login':
                return (
                    <Card className="bg-card border-none shadow-lg">
                        <CardHeader>
                           <KizaruLogo />
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="system">Sistema</Label>
                                    <Select name="system" required onValueChange={(value: System) => setSystem(value)}>
                                        <SelectTrigger id="system" className="bg-input border-border/50">
                                            <SelectValue placeholder="Selecione o sistema" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="android">Android</SelectItem>
                                            <SelectItem value="ios">iOS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {system === 'android' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="deviceModelInput">Modelo do Celular</Label>
                                        <Input id="deviceModelInput" name="deviceModelInput" placeholder="Ex: Samsung Galaxy S23" required className="bg-input border-border/50"/>
                                    </div>
                                )}

                                {system === 'ios' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="deviceModelSelect">Modelo do Celular</Label>
                                        <Select name="deviceModelSelect" required>
                                            <SelectTrigger id="deviceModelSelect" className="bg-input border-border/50">
                                                <SelectValue placeholder="Selecione seu iPhone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {IPHONE_MODELS.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input id="password" name="password" type="password" required className="bg-input border-border/50"/>
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold box-glow">Entrar</Button>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 'loading':
                const loadingMessage = system === 'ios'
                    ? "Carregando perfil de sensibilidade iOS…"
                    : "Carregando módulos de sensibilidade Android…";
                return <LoadingScreen message={loadingMessage} />;

            case 'sensitivity_select':
                return(
                    <div className="space-y-6 text-center">
                        <h2 className="text-3xl font-bold text-white">TIPO DE SENSIBILIDADE</h2>
                        <div className="space-y-4">
                            {(['low', 'medium', 'high'] as Sensitivity[]).map(s => (
                                <Card 
                                    key={s} 
                                    onClick={() => handleSelectSensitivity(s)} 
                                    className={`bg-card border-2 cursor-pointer transition-all duration-300 ${
                                        sensitivity === s
                                        ? 'border-primary box-glow transform scale-105'
                                        : `border-border/50 ${sensitivity ? 'opacity-60' : 'opacity-100'} hover:opacity-100 hover:border-primary/80`
                                    }`}
                                >
                                    <CardContent className="p-4">
                                        <p className="text-lg font-semibold text-white uppercase">{`Sensi ${s === 'low' ? 'Baixa' : s === 'medium' ? 'Média' : 'Alta'}`}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                         <Button onClick={handleGenerate} disabled={!sensitivity || isCoolingDown} className="w-full text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground py-6 box-glow disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
                            {isCoolingDown ? `Aguarde ${formatTime(remainingTime)}` : "GERAR SENSIBILIDADE"}
                        </Button>
                    </div>
                );
            
            case 'generating':
                return <LoadingScreen message="Calibrando sensibilidade..." />;

            case 'results':
                if (isCoolingDown && !generatedSettings) {
                    return (
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold text-white">TEMPO DE ESPERA</h2>
                            <p className="text-muted-foreground">Você deve esperar o tempo de recarga para gerar uma nova sensibilidade.</p>
                             <div className="text-4xl font-mono text-primary font-bold">{formatTime(remainingTime)}</div>
                            <Button onClick={() => setStep('sensitivity_select')} variant="outline">Voltar</Button>
                        </div>
                    );
                }

                if (!generatedSettings) return null;

                const isAndroid = 'dpi' in generatedSettings;

                return (
                    <Card className="bg-card border-primary/50">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-bold text-glow">KIZARU • PERFIL GERADO</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {isAndroid ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-input rounded-lg"><p>DPI: <span className="font-bold text-primary">{(generatedSettings as AndroidSettings).dpi}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg">
                                        <p>Velocidade do Cursor</p>
                                        <AnimatedSlider value={(generatedSettings as AndroidSettings).cursorSpeed} max={120} />
                                    </div>
                                    <div className="p-3 bg-input rounded-lg"><p>Escala de Animação: <span className="font-bold text-primary">{(generatedSettings as AndroidSettings).animationScale}</span></p></div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-3 bg-input rounded-lg"><p>Escaneamento Automático: <span className="font-bold text-primary">{(generatedSettings as IosSettings).autoScan}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg"><p>Pausa: <span className="font-bold text-primary">{(generatedSettings as IosSettings).pause}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg"><p>Repetição de Movimentos: <span className="font-bold text-primary">{(generatedSettings as IosSettings).movementRepetition}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg"><p>Pressão Longa: <span className="font-bold text-primary">{(generatedSettings as IosSettings).longPress}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg"><p>Ciclos: <span className="font-bold text-primary">{(generatedSettings as IosSettings).cycles}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg"><p>Cursor Móvel: <span className="font-bold text-primary">{(generatedSettings as IosSettings).mobileCursor}</span></p></div>
                                    <div className="p-3 bg-input rounded-lg"><p>Velocidade do Cursor Móvel: <span className="font-bold text-primary">{(generatedSettings as IosSettings).mobileCursorSpeed}</span></p></div>
                                </div>
                            )}
                            
                            <Button onClick={() => setStep('sensitivity_select')} disabled={isCoolingDown} className="w-full text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground py-6 box-glow disabled:opacity-50 disabled:cursor-not-allowed">
                                {isCoolingDown ? `Aguarde ${formatTime(remainingTime)}` : "Gerar Novamente"}
                            </Button>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            {step !== 'login' && (
                <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
                    <AlertDialogTrigger asChild>
                        <button className="fixed top-6 left-6 text-white/70 hover:text-primary/90 hover:opacity-100 transition-all z-30">
                            <LogOut className="h-6 w-6" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-primary/50">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deseja voltar para a tela de login?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Sua sessão atual será encerrada e você precisará inserir a senha novamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>Cancelar</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button onClick={handleLogout} className="bg-primary hover:bg-primary/90">Voltar</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            <AlertDialog open={showPostGenerationNotice} onOpenChange={setShowPostGenerationNotice}>
                <AlertDialogContent className="bg-card border-primary/50">
                    <AlertDialogHeader className="items-center text-center">
                        <CheckCircle className="h-10 w-10 text-primary mb-2" />
                        <AlertDialogTitle>AVISO</AlertDialogTitle>
                        <AlertDialogDescription>
                            Após gerar a sensibilidade, basta aplicar as configurações em seu telefone, abrir o Free Fire e jogar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <Button onClick={() => setShowPostGenerationNotice(false)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">ENTENDI</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {renderStep()}
        </div>
    );
}
