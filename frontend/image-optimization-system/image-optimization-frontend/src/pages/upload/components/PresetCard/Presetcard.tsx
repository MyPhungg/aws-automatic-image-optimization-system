import "./Presetcard.css";

import { PRESETS } from "../../../../constants/presets";

import type { CompressionPreset } from "../../../../types/ImageItem";

interface Props {

    selected: CompressionPreset;

    onChange: (

        preset: CompressionPreset

    ) => void;

}

function PresetCards({

    selected,

    onChange

}: Props) {

    return (

        <div className="preset-wrapper">

            <h2>

                Optimization Preset

            </h2>

            <p>

                Choose one preset for all uploaded images.

            </p>

            <div className="preset-grid">

                {

                    PRESETS.map((preset)=>(

                        <div

                            key={preset.id}

                            className={

                                selected===preset.id

                                ?

                                "preset-card active"

                                :

                                "preset-card"

                            }

                            onClick={()=>onChange(preset.id)}

                        >

                            <h3>

                                {preset.title}

                            </h3>

                            <p>

                                {preset.description}

                            </p>

                            <div className="preset-footer">

                                <span>

                                    Quality

                                    {preset.quality}

                                </span>

                                <span>

                                    Save

                                    {preset.estimatedSaving}

                                </span>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default PresetCards;