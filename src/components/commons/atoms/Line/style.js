import styled from 'styled-components';

export const Line = styled.span`
  display: inline-block;
  width: ${(props) => props.length};
  height: ${(props) => props.thickness};
  background-color: ${(props) => props.color};
`;
