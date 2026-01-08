import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react';
import { useState } from 'react';
import './App.css';
import { Turnstile } from '@marsidev/react-turnstile';

function App() {
	interface Form {
		name: string;
		email: string;
		message: string;
	}
	const [form, setForm] = useState<Form>({
		name: '',
		email: '',
		message: '',
	});
	const [error, setError] = useState<Form>({
		name: '',
		email: '',
		message: '',
	});
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [loader, setLoader] = useState<boolean>(false);
	const [errorResponse, setErrorResponse] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const api = import.meta.env.VITE_FORM_URL;
	const validateInputs = (inputs: Form) => {
		const errors: Form = {
			name: '',
			email: '',
			message: '',
		};
		const regexMail = new RegExp(
			/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
		);
		if (!regexMail.test(inputs.email)) {
			errors.email = 'Ingrese un Email valido, por favor';
		}
		if (!inputs.message) {
			errors.message = 'El mensaje no puede estar vacio';
		}
		if (!inputs.name) {
			errors.name = 'El nombre no puede estar vacio';
		}
		return errors;
	};

	const validateErrors = (errors: Form) => {
		return Object.values(errors).some((error) => error !== '');
	};
	const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
	const jwtToken = async () => {
		try {
			const key = import.meta.env.VITE_BACK_KEY_HEADERS;
			const fetchResponse = await fetch(`${api}/contact/form-token`, {
				method: 'POST',
				headers: {
					[key!]: import.meta.env.VITE_BACK_VALUE_HEADERS!,
					'Content-Type': 'application/json',
				},
			});
			if (!fetchResponse.ok) {
				return false
			}
			const data = await fetchResponse.json();
			return data.token;
		} catch (error) {
			return false
		}
	}
	const handleChange = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(validateInputs(form));
		if (!token) {
			setErrorResponse('Por favor, completa el captcha');
			setIsOpen(true);
			return;
		}
		const key = import.meta.env.VITE_BACK_KEY_HEADERS;
		if (!validateErrors(error)) {
			setLoader(true);
			try {
				const jwt = await jwtToken();
				if (!jwt) {
					setErrorResponse('Error inesperado, intente de nuevo');
					setIsOpen(true);
					return;
				}
				const fetchResponse = await fetch(`${api}/contact`, {
					method: 'POST',
					headers: {
						[key!]: import.meta.env.VITE_BACK_VALUE_HEADERS!,
						'turnstile-response': token,
						'Authorization': `Bearer ${jwt}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form),
				});


				const data = await fetchResponse.json();


				if (fetchResponse.ok) {
					setForm({ name: '', email: '', message: '' });
					setIsOpen(true);
					setLoader(false);
				} else {
					setErrorResponse(await data.message);
					setIsOpen(true);
					throw new Error(data);
				}
			} catch (error) {
				setErrorResponse('Error al enviar el formulario');
				setIsOpen(true);
				setLoader(false);
				console.error(error);
			}
		} else {
			setErrorResponse('Por favor, completa todos los campos');
			setIsOpen(true);
		}
	};

	return (
		<>
			<div className="flex justify-start pt-2 mt-2 ml-2 font-bold">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M5 12l14 0" />
					<path d="M5 12l6 6" />
					<path d="M5 12l6 -6" />
				</svg>
				<a href="https://emacuello-portafolio.vercel.app/">Volver a la pagina principal</a>
			</div>

			<h1 className="text-4xl font-extrabold leading-tight lg:text-6xl cursor-default text-center animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-transparent pt-2 pb-5 mb-5">
				Formulario de contacto
			</h1>
			<div className="my-6">
				<div className="grid sm:grid-cols-2 items-center gap-16 p-8 mx-auto max-w-4xl shadow-[0_2px_10px_-3px_rgba(116,86,255,0.3)] rounded-md text-[#7456FF] font-[sans-serif]">
					<div>
						<h1 className="text-3xl font-extrabold">Hablemos!</h1>
						<p className="text-sm text-gray-400  mt-3">
							Te interesó mi perfil?. Necesitas ayuda para el
							desarollo de tu proyecto? Si buscas a una persona
							apasionada en su trabajo, entonces, no dudes en
							contactarme! Estoy al abierto a ofertas de trabajo.
						</p>
						<div className="mt-12">
							<h2 className="text-lg font-extrabold">Email</h2>
							<ul className="mt-3">
								<li className="flex items-center">
									<div className="bg-inherit h-10 w-10 rounded-full flex items-center justify-center shrink-0">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20px"
											height="20px"
											fill="#8678f9"
											viewBox="0 0 479.058 479.058"
										>
											<path
												d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"
												data-original="#000000"
											/>
										</svg>
									</div>
									<a
										target="blank"
										href="mailto:ema.cuello1010@gmail"
										className="text-[#8678f9] text-sm ml-3"
									>
										<small className="block">Mail</small>
										<strong>
											ema.cuello1010@gmail.com
										</strong>
									</a>
								</li>
							</ul>
						</div>
						<div className="mt-12">
							<h2 className="text-lg font-extrabold">Socials</h2>
							<ul className="flex mt-3 space-x-4">
								<li className="bg-inherit h-10 w-10 rounded-full flex items-center justify-center shrink-0">
									<a
										href="https://github.com/emacuello"
										target="blank"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="36"
											height="36"
											viewBox="0 0 24 24"
											fill="#7456ff"
											className="icon icon-tabler icons-tabler-filled icon-tabler-brand-github border-[#7456FF] border-2 rounded-full"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											></path>
											<path d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z"></path>
										</svg>
									</a>
								</li>
								<li className=" h-10 w-10 rounded-full flex items-center justify-center shrink-0">
									<a
										href="https://www.linkedin.com/in/vcuellojrs/"
										target="_blank"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32px"
											height="32px"
											fill="#7456ff"
											viewBox="0 0 511 512"
										>
											<path
												d="M111.898 160.664H15.5c-8.285 0-15 6.719-15 15V497c0 8.285 6.715 15 15 15h96.398c8.286 0 15-6.715 15-15V175.664c0-8.281-6.714-15-15-15zM96.898 482H30.5V190.664h66.398zM63.703 0C28.852 0 .5 28.352.5 63.195c0 34.852 28.352 63.2 63.203 63.2 34.848 0 63.195-28.352 63.195-63.2C126.898 28.352 98.551 0 63.703 0zm0 96.395c-18.308 0-33.203-14.891-33.203-33.2C30.5 44.891 45.395 30 63.703 30c18.305 0 33.195 14.89 33.195 33.195 0 18.309-14.89 33.2-33.195 33.2zm289.207 62.148c-22.8 0-45.273 5.496-65.398 15.777-.684-7.652-7.11-13.656-14.942-13.656h-96.406c-8.281 0-15 6.719-15 15V497c0 8.285 6.719 15 15 15h96.406c8.285 0 15-6.715 15-15V320.266c0-22.735 18.5-41.23 41.235-41.23 22.734 0 41.226 18.495 41.226 41.23V497c0 8.285 6.719 15 15 15h96.403c8.285 0 15-6.715 15-15V302.066c0-79.14-64.383-143.523-143.524-143.523zM466.434 482h-66.399V320.266c0-39.278-31.953-71.23-71.226-71.23-39.282 0-71.239 31.952-71.239 71.23V482h-66.402V190.664h66.402v11.082c0 5.77 3.309 11.027 8.512 13.524a15.01 15.01 0 0 0 15.875-1.82c20.313-16.294 44.852-24.907 70.953-24.907 62.598 0 113.524 50.926 113.524 113.523zm0 0"
												data-original="#000000"
											/>
										</svg>
									</a>
								</li>
							</ul>
						</div>
					</div>

					<form
						className="ml-auo space-y-4 text-white font-semibold"
						onSubmit={handleSubmit}
					>
						<input
							type="text"
							name="name"
							placeholder="Nombre"
							required
							value={form.name}
							onChange={handleChange}
							className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#7456ff]"
						/>
						<input
							type="email"
							name="email"
							onChange={handleChange}
							required
							value={form.email}
							placeholder="Email"
							className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#7456ff]"
						/>
						<textarea
							placeholder="Mensaje"
							rows={6}
							name="message"
							required
							value={form.message}
							onChange={handleChange}
							className="w-full rounded-md px-4 border text-sm pt-2.5 outline-[#7456ff]"
						></textarea>
						<Turnstile
							siteKey={SITE_KEY}
							onSuccess={(token) => setToken(token)}
							options={{
								theme: 'dark',
								language: 'es',
							}}
						/>
						<button
							type="submit"
							className={`text-white bg-[#8678f9] hover:bg-[#7456ff] font-semibold rounded-md text-sm px-4 py-2.5 w-full ${loader && 'cursor-not-allowed'}`}
						>
							{loader ? 'Enviando...' : 'Enviar'}
						</button>
					</form>
				</div>
			</div>
			<div className="flex items-center justify-center h-16 pt-5 pb-0 mb-0 mt-5 cursor-default">
				<p className="text-white">Hecho con ❤️ por Emanuel</p>
				<a
					href="https://github.com/emacuello"
					target="blank"
					className="ml-2 text-white hove:text-[#7456FF]"
				>
					emacuello © 2024
				</a>
				<p className="ml-2 text-white">Formulario hecho en React</p>
			</div>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50 text-white"
			>
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="max-w-lg space-y-4 border bg-[#7456FF] p-12">
						<DialogTitle className="font-bold text-xl">
							{validateErrors(form)
								? 'Error al enviar los datos'
								: 'Formulario enviado con éxito!'}
						</DialogTitle>
						<Description
							className={`${validateErrors(form)
								? 'text-red-900'
								: 'text-black'
								} text-base font-semibold`}
						>
							{validateErrors(form)
								? 'No se pudo completar el envío, por favor intenta de nuevo'
								: 'Gracias por completar el formulario'}
						</Description>
						<p className="text-base">
							{validateErrors(form)
								? errorResponse
								: 'Ya recibí tu consulta, en breve te llegará mi respuesta, gracias por contactarme!'}
						</p>
						<div className="flex gap-4">
							<button
								className="margin-2 text-black bg-[#8678f9] hover:bg-[#7456ff] font-semibold rounded-md text-sm px-4 py-2"
								onClick={() => setIsOpen(false)}
							>
								{form.name.length > 0
									? 'Lo entiendo 😞'
									: 'Cerrar'}
							</button>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}

export default App;
