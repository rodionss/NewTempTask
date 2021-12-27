import styled from 'styled-components/native';
import { STATUS_BAR_HEIGHT } from '@utils/functions';
import { Text, Link } from '@components/main';
import Video from 'react-native-video';
import { THEME } from '../../../../const';

export const Wrapper = styled.KeyboardAvoidingView.attrs({
  behavior: 'padding',
  keyboardVerticalOffset: 0,
})`
  flex: 1;
  background-color: ${THEME.navBarBackground};
`;

export const ContentWrapper = styled.View`
  background-color: #111313;
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  padding: ${STATUS_BAR_HEIGHT}px 20px 20px 20px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const VideoContainer = styled.View`
  margin-top: 10px;
  padding: 0 20px;
  align-items: center;
`;

export const ButtonsWrapper = styled.View`
  background-color: ${THEME.navBarBackground};
  flex: 1;
  justify-content: space-between;
`;

export const InputWrapper = styled.View`
  background-color: #333232;
  border-radius: 24px;
  margin-top: 16px;
  height: 86px;
  width: 100%;
  padding: 0 20px;
  align-items: center;
`;

export const ButtonContainer = styled.View`
  width: 100%;
  height: 50px;
  align-items: center;
  margin-top: auto;
  padding: 0 20px 80px 20px;
  background-color: ${THEME.navBarBackground};
`;

export const OptionsWrapper = styled.View`
  margin-top: 10px;
`;

export const Option = styled(Link)`
  padding: 15px 20px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #242424;
`;

export const OptionLabel = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OptionInfo = styled.View``;

export const OptionText = styled(Text)`
  color: #fff;
  margin-left: 10px;
  font-weight: 400;
  font-size: 14px;
`;

export const OptionInfoText = styled(Text)`
  color: #919191;
  font-size: 14px;
  font-weight: 400;
  text-align: right;
`;

export const ButtonMedia = styled(Link)`
  width: 150px;
  aspect-ratio: 0.56;
  border-radius: 8px;
  background-color: #222;
  margin-bottom: 4px;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
`;

export const VideoButton = styled(Video)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
`;

export const ButtonText = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: #aaa;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  bounces: false,
  contentContainerStyle: {},
})``;
