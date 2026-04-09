import { apiRequest } from '@/services/api';

export function uploadImage(token: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);

  return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      if (!res.ok) return res.json().then((err) => { throw new Error(err.message || 'Upload failed'); });
      return res.json();
    })
    .then((data) => data.url as string);
}
