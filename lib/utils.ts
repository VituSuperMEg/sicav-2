import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B4D9', '#A8E6CF', '#FFD3B6', '#FFAAA5'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isInProximity(pos1: { x: number; y: number }, pos2: { x: number; y: number }, radius: number): boolean {
  return calculateDistance(pos1, pos2) <= radius;
}

export function calculateAudioVolume(distance: number, maxDistance: number): number {
  if (distance >= maxDistance) return 0;
  // Volume decreases with distance (inverse square law)
  const volumeFactor = 1 - (distance / maxDistance);
  return Math.pow(volumeFactor, 2);
}

