import React, { useState } from 'react'
import { Flex, Modal, InjectedModalProps } from 'husky-uikit'
// import { useAudioModeManager, useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
// import useTheme from 'hooks/useTheme'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [setRememberExpertModeAcknowledgement] = usePersistState(false, {
    localStorageKey: 'pancake_expert_mode_remember_acknowledgement',
  })
  // const [expertMode, toggleExpertMode] = useExpertModeManager()
  // const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  // const [audioPlay, toggleSetAudioMode] = useAudioModeManager()


  const { t } = useTranslation()
  // const { isDark, theme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setRememberExpertModeAcknowledgement={setRememberExpertModeAcknowledgement}
      />
    )
  }



  return (
    <Modal
      title={t('Settings')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px', overflowY: 'auto' }}
    >
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          <GasSettings />
        </Flex>
        <Flex pt="24px" flexDirection="column">
          <TransactionSettings />
        </Flex>
      </Flex>
    </Modal>
  )
}

export default SettingsModal
