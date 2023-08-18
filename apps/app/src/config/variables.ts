import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
export const isMacos = Platform.OS === 'macos';
export const isWindows = Platform.OS === 'windows';
export const isWeb = Platform.OS === 'web';
