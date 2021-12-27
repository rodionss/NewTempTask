import { Text } from '@components/main';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  background: #050505;
  flex: 1;
`;

export const Wrapper = styled.View`
  background: #111313;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  flex: 1;
`;

export const SectionHeader = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  color: #919191;
  padding: 9px 20px 12px 20px;
  width: ${Dimensions.get('window').width}px;
`;
