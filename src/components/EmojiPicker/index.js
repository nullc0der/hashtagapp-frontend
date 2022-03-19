import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import Picker from 'emoji-picker-react'

import s from './EmojiPicker.module.scss'

const EmojiPicker = ({ flagsOnly, onEmojiClick, onClosePicker }) => {
    const wrapperRef = useRef(null)
    const cx = classNames(s.container)
    const groupVisibility = !flagsOnly
        ? {
              smileys_people: true,
              animals_nature: true,
              food_drink: true,
              travel_places: true,
              activities: true,
              objects: true,
              symbols: true,
              flags: false,
              recently_used: false,
          }
        : {
              smileys_people: false,
              animals_nature: false,
              food_drink: false,
              travel_places: false,
              activities: false,
              objects: false,
              symbols: false,
              flags: true,
              recently_used: false,
          }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                onClosePicker()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef, onClosePicker])

    return (
        <div className={cx} ref={wrapperRef}>
            <Picker
                onEmojiClick={onEmojiClick}
                groupVisibility={groupVisibility}
            />
        </div>
    )
}

export default EmojiPicker
