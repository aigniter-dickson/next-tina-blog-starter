import styled from 'styled-components'
import css from '@styled-system/css'
import { useCMS } from 'tinacms'
import { CloseIcon, EditIcon } from '@tinacms/icons'

const Button = styled.button`
  & {
    svg {
      height: calc(32 / 18 * 1em);
      width: auto;
      margin-left: calc((32 - 18) / 32 * -1em);
      path {
        fill: currentColor;
      }
    }
  }
`;

export const EditButton = () => {
  const cms = useCMS()

  return (
    <>
      <Button onClick={cms.toggle}>
        <span
          className="flex items-center mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
        >
          {cms.enabled ? <CloseIcon /> : <EditIcon />}
          <span>&nbsp;&nbsp;</span>
          {cms.enabled ? 'Exit Edit Mode' : 'Edit This Site'}
        </span>
      </Button>
    </>
  )
}

export default EditButton