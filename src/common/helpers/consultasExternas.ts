import {
  HttpException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';

export const solicitudGet = async <T = any>({
  url,
  params,
}: {
  url: string;
  params?: Record<string, any>;
}): Promise<T> => {
  try {
    const response = await axios.get<T>(url, { params });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.code === 'ECONNREFUSED') {
      throw new ServiceUnavailableException(
        'Error de conexión con el servidor remoto. El servicio no está disponible.',
      );
    }

    if (axiosError.response) {
      const status = axiosError.response.status;
      const remoteData = axiosError.response.data;

      throw new HttpException(
        remoteData || `Error externo: HTTP ${status}`,
        status,
      );
    }

    throw new InternalServerErrorException(
      'Error desconocido durante la solicitud externa.',
    );
  }
};
