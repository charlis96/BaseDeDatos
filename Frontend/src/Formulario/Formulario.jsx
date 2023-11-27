import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../UserProvider';

import { toast } from 'react-toastify';
import { api } from '../api/instance';


function Formulario() {

    const { userData } = useUser();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const conCarnet = watch("conCarnet");
    const [fechaNacimientoType, setFechaNacimientoType] = useState('text');
    const [fechaVencimientoType, setFechaVencimientoType] = useState('text');
    const [fechaEmisionType, setFechaEmisionType] = useState('text');

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    const today = new Date();
    const fechaVencimiento = new Date(data.fechaVencimientoCarne);

    if (fechaVencimiento < today) {
        toast.error("La fecha de vencimiento es anterior a la fecha actual. Necesitas hacer una reserva de agenda.");
        return;
    }

    for (const key in data) {
        if (key === 'carnetJPG') {
          formData.append(key, data[key][0]); 
        } else {
          formData.append(key, data[key]); 
        }
      }

      api.put(`/funcionarios/updateFuncionarioByCI`, formData)
      .then(response => {
        toast.success('Formulario enviado con éxito');
        navigate('/Index');
      })
      .catch(error => {
        console.error('Error al enviar formulario:', error);
      });
    });  

  const goBack = () => {
    navigate('/Indice');
  };

  const navigateToAgenda = () => {
    navigate('/Agenda');
};

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center"> 
      <div className="max-w-sm w-full mx-auto">
        <div className="text-3xl font-bold text-gray-900 mt-2 text-center"> Formulario </div>
      </div>
        <div className="max-w-sm w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <form onSubmit={onSubmit} className="space-y-6" encType="multipart/form-data">
            <div className='flex flex-col space-y-4'>
                <input 
                    {...register('ci', { required: "Este campo es obligatorio", pattern: { value: /^[0-9]+$/i, message:"Solo se permiten numeros" }})} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={userData?.cedula}
                    placeholder={userData?.cedula || "Cédula de identidad"}
                    />
                {errors.CI && <span className="text-red-600 text-sm">{errors.CI.message}</span>}
                <input 
                    {...register('nombre', { required: "Este campo es obligatorio"})} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={userData?.nombre}
                    placeholder={userData?.nombre || "Nombre"}
                    />
                {errors.CI && <span className="text-red-600 text-sm">{errors.CI.message}</span>}
                <input 
                    {...register('apellido', { required: "Este campo es obligatorio"})} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={userData?.apellido}
                    placeholder={userData?.apellido || "Apellido"}
                    />
                {errors.CI && <span className="text-red-600 text-sm">{errors.CI.message}</span>}
                <input 
                    type={fechaNacimientoType} 
                    onFocus={() => setFechaNacimientoType('date')}
                    onBlur={() => setFechaNacimientoType('text')}
                    {...register('fechaNacimiento', { required: true })} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={userData?.fechaNacimiento}
                    placeholder={userData?.fechaNacimiento || "Fecha de nacimiento"}
                />
                {errors.fechaNacimiento && <span className="text-red-600 text-sm">Este campo es requerido</span>}

                <label className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        {...register('conCarnet')} 
                        className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>¿Tiene carné de salud?</span>
                    <span 
                    className="text-xs text-decoration-line: underline text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={navigateToAgenda}
                    >
                    Reservar Agenda
                    </span>
                </label>

                {conCarnet && (
                    <>
                        <input 
                            type={fechaEmisionType}
                            onFocus={() => setFechaEmisionType('date')}
                            onBlur={() => setFechaEmisionType('text')}
                            {...register('fechaEmisionCarne')} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Fecha de emisión del carné" 
                        />
                        <input 
                            type={fechaVencimientoType}
                            onFocus={() => setFechaVencimientoType('date')}
                            onBlur={() => setFechaVencimientoType('text')}
                            {...register('fechaVencimientoCarne')} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Fecha de vencimiento del carné" 
                        />
                        <input 
                            type="file" 
                            {...register('comprobante')} 
                            accept="image/jpeg, image/png" 
                            className="file:mr-4 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </>
                )}

                <input 
                    {...register('direccion', { required: true })} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={userData?.direccion}
                    placeholder={userData?.direccion || "Domicilio"} 
                />
                {errors.domicilio && <span className="text-red-600 text-sm">Este campo es requerido</span>}

                <input 
                    type="email" 
                    {...register('email', { required: true })} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={userData?.email}
                    placeholder={userData?.email || "Correo electrónico"}
                />
                {errors.correo && <span className="text-red-600 text-sm">Este campo es requerido</span>}

                <input 
                    type="tel" 
                    {...register('telefono', { 
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Solo se permiten números"
                      }
                    })} 
                    defaultValue={userData?.telefono}
                    placeholder={userData?.telefono || "Teléfono"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                {errors.telefono && <span className="text-red-600 text-sm">{errors.telefono.message}</span>}   
            </div>

            <div className="flex justify-center mt-6">
              <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"> Submit </button>
            </div>
          </form>
          <div className="flex justify-center mt-4">
          <button
            type="button" 
            onClick={goBack}
            className="py-2 px-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white font-bold text-xs"
          >
            Volver
          </button>
        </div>
        </div>
    </div>
  )
}

export default Formulario;