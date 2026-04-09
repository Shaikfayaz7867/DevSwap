import { apiRequest } from '@/services/api';

export function uploadFile(token: string, file: File) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  const formData = new FormData();
  formData.append('file', file);

  return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload/file`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data.url as string;
    });
}
