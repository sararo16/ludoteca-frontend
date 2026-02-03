
//este archivo se encarga de definir hooks personalizados 
import {  useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

//Version tipada de useDispatch y 
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
