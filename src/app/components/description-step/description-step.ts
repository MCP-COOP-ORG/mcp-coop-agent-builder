import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BUILDER_STEPS, STEP_IDS, DESCRIPTION_BLOCKS, BUILDER_DICTIONARY, BuilderFieldConfig } from '@shared/constants';
import { StepLayout, RadioGroup, TextareaField, InputField, MultiSelectField, SelectField } from '@shared/components';
import { BaseFormStep } from '@shared/directives';
import { CheckboxGroup } from '../checkbox-group/checkbox-group';
import { PresetManager } from '@services';

/**
 * Dumb component that represents the "Description" step in the Builder.
 * It passes configuration to the universal StepLayout and projects specific controls.
 */
@Component({
    selector: 'app-description-step',
    imports: [
        StepLayout,
        RadioGroup,
        CheckboxGroup,
        TextareaField,
        InputField,
        MultiSelectField,
        SelectField,
        ReactiveFormsModule,
    ],
    templateUrl: './description-step.html',
    styleUrl: './description-step.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionStep extends BaseFormStep {
    private readonly presetManager = inject(PresetManager);

    /**
     * View Model containing all static template-bound data to avoid polluting the component class.
     * Adheres to the Zero Literals Policy by sourcing data from constants.
     */
    get view() {
        return {
            step: BUILDER_STEPS.find((step) => step.id === STEP_IDS.DESCRIPTION)!,
            blocksArray: this.blocksArray(),
            dictionary: BUILDER_DICTIONARY,
        };
    }

    readonly blocksArray = computed(() => {
        const presets = this.presetManager.presets();
        const blocks = JSON.parse(JSON.stringify(DESCRIPTION_BLOCKS));

        // Find preset field and populate options
        for (const block of blocks) {
            if (block.fields) {
                const presetField = block.fields.find((f: BuilderFieldConfig) => f.id === 'preset');
                if (presetField) {
                    presetField.options = presets.map((p) => ({
                        id: p.id,
                        label: p.isSystem ? `${p.name} (System)` : p.name,
                    }));
                }
            }
        }
        return blocks;
    });

    protected get stateSignal() {
        return this.builderState.descriptionData;
    }

    override ngOnInit(): void {
        super.ngOnInit();

        // Listen to preset changes
        this.form.get('projectIdentity.preset')?.valueChanges.subscribe((presetId) => {
            if (presetId) {
                this.presetManager.loadPreset(presetId);
            }
        });
    }
}
